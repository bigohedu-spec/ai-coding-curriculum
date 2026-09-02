#!/usr/bin/env python3
"""Validate the cross-file contract for a new S3 GAMMA answer-card course.

This checks structural invariants. It intentionally does not judge story quality.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Iterable


START = "<!-- LAB_TERMINAL_WORKSHEET_CONFIG_START -->"
END = "<!-- LAB_TERMINAL_WORKSHEET_CONFIG_END -->"
PROFILES = {"onboarding", "guided-chain", "semi-open-chain", "autonomous-chain"}
MEDIA = {
    "image": ("image", ("image/png", "image/jpeg", "image/webp")),
    "music": ("audio", ("audio/mpeg", "audio/mp3", "audio/wav", "audio/mp4")),
    "video": ("video", ("video/mp4", "video/webm", "video/quicktime")),
}


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def read_text(path: Path, report: Report) -> str:
    try:
        return path.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeError) as exc:
        report.error(f"Cannot read {path}: {exc}")
        return ""


def extract_config(text: str, report: Report) -> dict[str, Any] | None:
    if text.count(START) != 1 or text.count(END) != 1:
        report.error("Course spec must contain exactly one worksheet config marker pair.")
        return None
    body = text.split(START, 1)[1].split(END, 1)[0]
    match = re.search(r"```json\s*(\{.*?\})\s*```", body, flags=re.S)
    if not match:
        report.error("Config markers do not contain one fenced JSON object.")
        return None
    try:
        value = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        report.error(f"Embedded JSON is invalid: line {exc.lineno}, column {exc.colno}: {exc.msg}")
        return None
    if not isinstance(value, dict):
        report.error("Embedded config must be a JSON object.")
        return None
    return value


def h2_headings(text: str) -> list[str]:
    return [m.group(1).strip() for m in re.finditer(r"^##\s+(.+?)\s*$", text, flags=re.M)]


def duplicate_values(values: Iterable[str]) -> set[str]:
    seen: set[str] = set()
    dupes: set[str] = set()
    for value in values:
        if value in seen:
            dupes.add(value)
        seen.add(value)
    return dupes


def expected_identity(path: Path) -> tuple[str, str, int] | None:
    match = re.search(r"S(\d+)-W(\d{2})-學習單\.md$", path.name)
    if not match:
        return None
    semester_num, week_text = match.groups()
    return f"S{semester_num}W{week_text}", f"S{semester_num}-W{week_text}", int(week_text)


def question_checks(question: dict[str, Any]) -> list[dict[str, Any]]:
    checks: list[dict[str, Any]] = []
    for field in ("preReadChecks", "readChecks"):
        raw = question.get(field, [])
        if isinstance(raw, list):
            checks.extend(item for item in raw if isinstance(item, dict))
    return checks


def validate_choice(check: dict[str, Any], label: str, report: Report) -> None:
    if check.get("type") != "choice":
        return
    options = check.get("options")
    answer = check.get("answerIndex")
    if not isinstance(options, list) or len(options) < 3:
        report.error(f"{label}: choice check must have at least 3 options.")
        return
    if not isinstance(answer, int) or not 0 <= answer < len(options):
        report.error(f"{label}: answerIndex is outside the options array.")
    if len({str(item).strip() for item in options}) != len(options):
        report.error(f"{label}: choice options must be unique.")
    if not str(check.get("successFeedback", "")).strip():
        report.warn(f"{label}: missing concise successFeedback.")
    if not str(check.get("retryFeedback", "")).strip():
        report.warn(f"{label}: missing direction-only retryFeedback.")


def validate_config(
    config: dict[str, Any], worksheet_path: Path, worksheet_text: str, report: Report
) -> None:
    required = {
        "schemaVersion",
        "id",
        "courseId",
        "title",
        "semester",
        "week",
        "source",
        "contentRevision",
        "contentSource",
        "storageVersion",
        "scaffoldProfile",
        "studentToolHints",
        "initialQuestionId",
        "questions",
    }
    missing = sorted(required - config.keys())
    if missing:
        report.error(f"Missing top-level config fields: {', '.join(missing)}")

    if config.get("schemaVersion") != 3:
        report.error("New S3 answer-card courses must use schemaVersion 3.")
    if config.get("source") != "gamma-answer-worksheet":
        report.error("source must be gamma-answer-worksheet.")

    identity = expected_identity(worksheet_path)
    if identity:
        expected_id, expected_course, expected_week = identity
        if config.get("id") != expected_id:
            report.error(f"Config id must be {expected_id} for {worksheet_path.name}.")
        if config.get("courseId") != expected_course:
            report.error(f"courseId must be {expected_course} for {worksheet_path.name}.")
        if config.get("semester") != expected_course.split("-", 1)[0]:
            report.error("semester does not match the worksheet filename.")
        if config.get("week") != expected_week:
            report.error("week does not match the worksheet filename.")
    else:
        report.warn("Worksheet filename does not follow S3-WNN-學習單.md; identity checks skipped.")

    revisions = re.findall(r"<!--\s*CONTENT_REVISION:\s*([^\s]+)\s*-->", worksheet_text)
    if len(revisions) != 1:
        report.error("Worksheet must contain exactly one CONTENT_REVISION comment.")
    elif config.get("contentRevision") != revisions[0]:
        report.error(
            f"contentRevision mismatch: worksheet={revisions[0]!r}, config={config.get('contentRevision')!r}."
        )

    source = config.get("contentSource")
    if not isinstance(source, dict) or source.get("type") != "markdown":
        report.error("contentSource must be a markdown source object.")
    else:
        expected_suffix = f"wiki/worksheets/S3/{worksheet_path.name}"
        actual_path = str(source.get("path", "")).replace("\\", "/")
        if actual_path != expected_suffix:
            report.error(f"contentSource.path must be {expected_suffix!r}; got {actual_path!r}.")

    profile = config.get("scaffoldProfile")
    if profile not in PROFILES:
        report.error(f"scaffoldProfile must be one of: {', '.join(sorted(PROFILES))}.")
        profile = None
    if profile in {"semi-open-chain", "autonomous-chain"} and config.get("studentToolHints") is not False:
        report.error(f"{profile} requires studentToolHints=false.")
    if profile == "autonomous-chain" and config.get("reviewFeedbackMode") != "direction-only":
        report.error("autonomous-chain requires reviewFeedbackMode=direction-only.")

    questions = config.get("questions")
    if not isinstance(questions, list) or not questions:
        report.error("questions must be a non-empty array.")
        return
    if not all(isinstance(item, dict) for item in questions):
        report.error("Every questions entry must be an object.")
        return

    ids = [str(item.get("id", "")) for item in questions]
    task_ids = [str(item.get("taskId", "")) for item in questions]
    for label, values in (("question id", ids), ("taskId", task_ids)):
        if "" in values:
            report.error(f"Every question must have a non-empty {label}.")
        dupes = duplicate_values(values)
        if dupes:
            report.error(f"Duplicate {label} values: {', '.join(sorted(dupes))}")
    if config.get("initialQuestionId") not in ids:
        report.error("initialQuestionId does not identify a question.")

    headings = h2_headings(worksheet_text)
    heading_set = set(headings)
    duplicate_headings = duplicate_values(headings)
    if duplicate_headings:
        report.error(f"Worksheet has duplicate H2 headings: {', '.join(sorted(duplicate_headings))}")

    all_check_ids: list[str] = []
    main_coin_sum = 0
    seen_question_ids: set[str] = set()
    for index, question in enumerate(questions):
        qid = str(question.get("id", f"index-{index}"))
        label = f"question {qid}"
        content_ref = question.get("contentRef")
        if not isinstance(content_ref, str) or content_ref not in heading_set:
            report.error(f"{label}: contentRef {content_ref!r} does not match a unique worksheet H2.")
        if not str(question.get("taskId", "")).startswith(str(config.get("courseId", "")) + "-"):
            report.error(f"{label}: taskId must start with {config.get('courseId')}-.")

        expected_kind = question.get("expectedKind")
        is_prologue = expected_kind == "none" or str(question.get("taskId", "")).endswith("-PROLOGUE")
        coins = question.get("coins")
        if not isinstance(coins, int) or coins < 0:
            report.error(f"{label}: coins must be a non-negative integer.")
        elif is_prologue and coins != 0:
            report.error(f"{label}: prologue/none tasks must award 0 coins.")
        elif not is_prologue:
            main_coin_sum += coins

        if not is_prologue and question.get("interactionMode") != "one-question-one-result":
            report.error(f"{label}: main tasks must use one-question-one-result.")
        if is_prologue and question.get("interactionMode") == "reading-check-only":
            if question.get("responseCards") != []:
                report.error(f"{label}: reading-check-only prologue requires responseCards=[].")
            unlock_id = question.get("unlockOnPass")
            if unlock_id not in ids or ids.index(unlock_id) <= index:
                report.error(
                    f"{label}: reading-check-only prologue unlockOnPass must identify a later question."
                )

        tool_id = question.get("toolId")
        if tool_id in MEDIA:
            kind, mime_prefixes = MEDIA[tool_id]
            if expected_kind != kind:
                report.error(f"{label}: toolId={tool_id} requires expectedKind={kind}.")
            prompt_review = question.get("promptReviewCriteria")
            if not isinstance(prompt_review, dict) or not prompt_review.get("explicitEvidenceGroups"):
                report.error(f"{label}: media tasks require explicit prompt evidence groups.")
            criteria = question.get("reviewCriteria")
            allowed = criteria.get("allowedMimeTypes", []) if isinstance(criteria, dict) else []
            if not allowed or not all(str(item).startswith(mime_prefixes) for item in allowed):
                report.error(f"{label}: allowedMimeTypes do not match toolId={tool_id}.")
            if not isinstance(criteria, dict) or criteria.get("minAttachments") != 1:
                report.error(f"{label}: media tasks require exactly one minimum attachment.")
        elif tool_id == "terminal" and expected_kind != "text":
            report.error(f"{label}: terminal requires expectedKind=text.")

        criteria = question.get("reviewCriteria")
        if not isinstance(criteria, dict):
            report.error(f"{label}: missing reviewCriteria object.")
        elif criteria.get("aiReviewMode") != "local-only":
            report.warn(f"{label}: aiReviewMode is not local-only; document a local fallback.")

        pre = question.get("preReadChecks", [])
        reads = question.get("readChecks", [])
        if pre is not None and not isinstance(pre, list):
            report.error(f"{label}: preReadChecks must be an array.")
            pre = []
        if reads is not None and not isinstance(reads, list):
            report.error(f"{label}: readChecks must be an array.")
            reads = []

        if isinstance(criteria, dict):
            declared_pre = criteria.get("requiredPreReadChecks")
            declared_reads = criteria.get("requiredReadChecks")
            if declared_pre is not None and declared_pre != len(pre):
                report.error(
                    f"{label}: requiredPreReadChecks={declared_pre!r} but preReadChecks has {len(pre)} item(s)."
                )
            if declared_reads is not None and declared_reads != len(reads):
                report.error(
                    f"{label}: requiredReadChecks={declared_reads!r} but readChecks has {len(reads)} item(s)."
                )

        if profile == "autonomous-chain" and not is_prologue:
            if "toolPrompt" in question:
                report.error(f"{label}: autonomous-chain forbids toolPrompt.")
            if not str(question.get("studentGuidance", "")).strip():
                report.error(f"{label}: autonomous-chain requires direction-only studentGuidance.")
            if len(pre) != 3:
                report.error(f"{label}: autonomous-chain requires exactly 3 preReadChecks.")
            if not reads:
                report.error(f"{label}: autonomous-chain requires post-task readChecks.")
            mantra = [item for item in reads if isinstance(item, dict) and item.get("isMantraCheck")]
            if len(mantra) != 1:
                report.error(f"{label}: autonomous-chain requires exactly one mantra readCheck.")
        if profile == "semi-open-chain" and not is_prologue:
            if question.get("studentPromptEditable") is not True:
                report.error(f"{label}: semi-open-chain requires studentPromptEditable=true.")
            phases = [item.get("phase") for item in reads if isinstance(item, dict)]
            if phases and phases != ["review", "next-reading"]:
                report.warn(f"{label}: semi-open-chain normally uses review then next-reading.")

        for check in question_checks(question):
            check_id = str(check.get("id", ""))
            if not check_id:
                report.error(f"{label}: every check needs a stable id.")
            all_check_ids.append(check_id)
            validate_choice(check, f"{label}/{check_id or 'unnamed-check'}", report)
            next_ref = check.get("nextContentRef")
            if next_ref is not None and next_ref not in heading_set:
                report.error(f"{label}/{check_id}: nextContentRef {next_ref!r} is not a worksheet H2.")

        read_objects = [item for item in reads if isinstance(item, dict)]
        display_orders = [item.get("displayOrder") for item in read_objects if "displayOrder" in item]
        if display_orders:
            if len(display_orders) != len(read_objects):
                report.warn(f"{label}: only some readChecks declare displayOrder.")
            elif not all(isinstance(item, int) for item in display_orders):
                report.error(f"{label}: readCheck displayOrder values must be integers.")
            elif display_orders != list(range(1, len(display_orders) + 1)):
                report.error(f"{label}: readCheck displayOrder must follow rendered order starting at 1.")

        auto_context = question.get("autoContextFrom", [])
        if auto_context is not None and not isinstance(auto_context, list):
            report.error(f"{label}: autoContextFrom must be an array.")
        elif isinstance(auto_context, list):
            for ref in auto_context:
                ref_text = str(ref)
                qmatch = re.fullmatch(r"([A-Za-z0-9_-]+)\.passContent", ref_text)
                if qmatch and qmatch.group(1) not in seen_question_ids:
                    report.error(f"{label}: autoContextFrom references future or unknown question {ref_text!r}.")
        seen_question_ids.add(qid)

    if main_coin_sum != 250:
        report.error(f"Main-task coin sum must be 250; found {main_coin_sum}.")
    duplicate_checks = duplicate_values(all_check_ids)
    if duplicate_checks:
        report.error(f"Duplicate check IDs: {', '.join(sorted(duplicate_checks))}")


def validate_student_boundary(text: str, report: Report) -> None:
    forbidden = {
        "LAB_TERMINAL_WORKSHEET_CONFIG": "machine config",
        '"answerIndex"': "quiz answerIndex",
        '"passContent"': "hidden passContent",
    }
    for token, label in forbidden.items():
        if token in text:
            report.error(f"Student worksheet leaks {label} ({token}).")
    brands = re.findall(r"\b(?:ChatGPT|Claude|Runway|Pika|Suno)\b", text, flags=re.I)
    if brands:
        report.warn(f"Student worksheet contains third-party AI brands: {', '.join(sorted(set(brands)))}")


def validate_lesson_plan(text: str, course_id: str | None, report: Report) -> None:
    if START in text or '"schemaVersion"' in text:
        report.error("Lesson plan must not contain the worksheet machine config.")
    required_sections = ("基本資訊", "課前準備", "課堂流程", "技術備援", "翻轉教育", "成功條件")
    for section in required_sections:
        if section not in text:
            report.warn(f"Lesson plan does not mention required area: {section}.")
    if course_id and course_id not in text:
        report.warn(f"Lesson plan does not visibly reference {course_id}.")


def print_report(report: Report, as_json: bool) -> None:
    payload = {
        "errors": report.errors,
        "warnings": report.warnings,
        "errorCount": len(report.errors),
        "warningCount": len(report.warnings),
    }
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return
    print(f"S3 answer-course contract: {len(report.errors)} error(s), {len(report.warnings)} warning(s)")
    for message in report.errors:
        print(f"ERROR: {message}")
    for message in report.warnings:
        print(f"WARN:  {message}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("worksheet", type=Path)
    parser.add_argument("course_spec", type=Path)
    parser.add_argument("--lesson-plan", type=Path)
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args()

    report = Report()
    worksheet_text = read_text(args.worksheet, report)
    spec_text = read_text(args.course_spec, report)
    validate_student_boundary(worksheet_text, report)
    config = extract_config(spec_text, report)
    if config is not None:
        validate_config(config, args.worksheet, worksheet_text, report)
    if args.lesson_plan:
        lesson_text = read_text(args.lesson_plan, report)
        validate_lesson_plan(lesson_text, str(config.get("courseId")) if config else None, report)
    print_report(report, args.as_json)
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
