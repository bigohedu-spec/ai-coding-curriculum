#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ect_estimator.py — 活動耗時估算引擎（AI 程式教育課）

依年級把活動拆成原子動作，估算所需秒數，用來判斷教案/學習單/互動課程內容
是否太長或太短。計算為純函式，結果可重現（不靠 LLM 猜測）。

模型（使用者校準）：
  年級係數 f = (grade + 1) / 2     # 一年級=1, 三年級=2, 五年級=3, 二/四/六=1.5/2.5/3.5
  基準（一年級 f=1）：
    - 打字 type   : 8 秒/字   → 8/f
    - 點擊 click  : 8 秒/次   → 8/f   （找元件 + 點擊）
    - 閱讀 read   : 2 秒/字   → 2/f   （= 打字速度的 1/4）
    - 單則指令閱讀上限 = 10 字 → 10*f；超過則發出「應拆分」警告
  固定動作（與年級無關，可覆寫）：
    - screenshot 截圖           : 10 秒/次
    - tell_teacher 舉手告知老師 : 30 秒/次（含等待）
    - teacher_confirm 老師驗收  : 20 秒/次
    - think 思考/決策           : 15 秒/次（預設，可調）
    - transition 換頁/動畫      : 2 秒/次

用法：
  python ect_estimator.py spec.json
  python ect_estimator.py --grade 3 --target 50 65 spec.json
  python ect_estimator.py --grade 1 --type 20 --click 5 --read 30   # 快速試算
  python ect_estimator.py spec.json --json                          # 輸出 JSON
"""

import argparse
import json
import sys

# ---- 模型常數 -------------------------------------------------------------

BASE_READ_LIMIT = 10          # 一年級單則指令字數上限
SCALED = {                    # 隨年級加速：實際秒 = base / f
    "type": 8.0,              # 每字
    "read": 2.0,              # 每字（打字 1/4）
    "click": 8.0,             # 每次（找元件+點擊）
    "drag": 16.0,             # 每次（拖拉 = 找來源 + 找目標 ≈ 2 次點擊）
    "mc_navigate": 16.0,      # 每次（Minecraft 3D 世界中移動/尋找）
    "mc_action": 8.0,         # 每次（挖/放/合成等單一原生操作）
    "motor_practice": 25.0,   # 每次（初學者馬達技能練習：移動+對準+點擊+重置，含失誤重試）
}
FIXED = {                     # 與年級無關，每次固定秒數（可用 seconds 覆寫）
    "screenshot": 10.0,
    "tell_teacher": 30.0,
    "teacher_confirm": 20.0,
    "think": 15.0,
    "transition": 2.0,
}
CHAR_ACTIONS = {"type", "read"}  # 以「字數」計，其餘以「次數」計


def factor(grade):
    """年級係數 f = (grade+1)/2。一年級=1。"""
    return (grade + 1) / 2.0


def estimate_one(act, default_grade):
    """估算單一活動，回傳 (秒數, 警告list, 標準化資訊dict)。"""
    action = act.get("action")
    if action is None:
        raise ValueError(f"活動缺少 action 欄位: {act}")
    grade = act.get("grade", default_grade)
    f = factor(grade)
    label = act.get("label", action)
    warnings = []

    if action in SCALED:
        base = SCALED[action]
        if action in CHAR_ACTIONS:
            n = act.get("chars", 0)
            unit = "字"
        else:
            n = act.get("count", 1)
            unit = "次"
        seconds = n * base / f
        # 閱讀超量檢查（單則指令）
        if action == "read":
            limit = BASE_READ_LIMIT * f
            chunk = act.get("instruction_chars", act.get("chars", 0))
            if chunk > limit:
                warnings.append(
                    f"⚠ 閱讀「{label}」單則 {chunk} 字 > {grade} 年級上限 {limit:.0f} 字，建議拆成多則或改用圖示"
                )
        detail = f"{n}{unit} × {base}/{f:g}"
    elif action in FIXED:
        n = act.get("count", 1)
        per = act.get("seconds", FIXED[action])
        seconds = n * per
        detail = f"{n}次 × {per:g}秒(固定)"
    elif action == "select":
        # 選擇題 = 讀所有選項字數 + 1 次點擊
        opt_chars = act.get("option_chars", 0)
        n = act.get("count", 1)
        per = (opt_chars * SCALED["read"] + SCALED["click"]) / f
        seconds = n * per
        detail = f"{n}題 ×（讀{opt_chars}字+1點擊）/{f:g}"
    else:
        raise ValueError(f"未知 action: {action}（見 action-catalog.md）")

    return seconds, warnings, {"label": label, "action": action,
                               "grade": grade, "detail": detail,
                               "seconds": round(seconds, 1)}


def estimate(spec):
    """spec: dict，含 grade / target_min / activities。回傳結果 dict。"""
    default_grade = spec.get("grade", 1)
    target = spec.get("target_min", [50, 65])  # 分鐘
    rows, all_warnings, total = [], [], 0.0
    for act in spec.get("activities", []):
        sec, warns, info = estimate_one(act, default_grade)
        total += sec
        rows.append(info)
        all_warnings.extend(warns)

    minutes = total / 60.0
    lo, hi = target
    if minutes < lo:
        verdict = "太短"
    elif minutes > hi:
        verdict = "太長"
    else:
        verdict = "剛好"

    return {"default_grade": default_grade, "target_min": target,
            "rows": rows, "total_seconds": round(total, 1),
            "total_minutes": round(minutes, 1), "verdict": verdict,
            "warnings": all_warnings}


def print_report(r):
    print("=" * 64)
    print(f"活動耗時估算　預設年級：{r['default_grade']}　"
          f"目標區間：{r['target_min'][0]}–{r['target_min'][1]} 分鐘")
    print("=" * 64)
    print(f"{'活動':<22}{'年級':>4}{'明細':>20}{'秒':>8}")
    print("-" * 64)
    for row in r["rows"]:
        label = row["label"][:20]
        print(f"{label:<22}{row['grade']:>4}{row['detail']:>20}{row['seconds']:>8}")
    print("-" * 64)
    print(f"合計：{r['total_seconds']} 秒 ≈ {r['total_minutes']} 分鐘")
    print(f"判定：【{r['verdict']}】"
          f"（目標 {r['target_min'][0]}–{r['target_min'][1]} 分鐘）")
    if r["warnings"]:
        print("\n警告：")
        for w in r["warnings"]:
            print("  " + w)
    print("=" * 64)


def main(argv=None):
    p = argparse.ArgumentParser(description="活動耗時估算引擎")
    p.add_argument("spec", nargs="?", help="活動 JSON 檔路徑")
    p.add_argument("--grade", type=float, help="預設年級（覆寫 spec）")
    p.add_argument("--target", nargs=2, type=float, metavar=("LO", "HI"),
                   help="目標分鐘區間，預設 50 65")
    p.add_argument("--type", type=int, help="快速試算：打字字數")
    p.add_argument("--read", type=int, help="快速試算：閱讀字數")
    p.add_argument("--click", type=int, help="快速試算：點擊次數")
    p.add_argument("--json", action="store_true", help="輸出 JSON")
    a = p.parse_args(argv)

    if a.spec:
        with open(a.spec, encoding="utf-8") as fh:
            spec = json.load(fh)
    else:
        # 快速試算模式
        acts = []
        if a.type:
            acts.append({"label": "打字", "action": "type", "chars": a.type})
        if a.read:
            acts.append({"label": "閱讀", "action": "read", "chars": a.read})
        if a.click:
            acts.append({"label": "點擊", "action": "click", "count": a.click})
        if not acts:
            p.error("請給 spec 檔，或用 --type/--read/--click 快速試算")
        spec = {"activities": acts}

    if a.grade is not None:
        spec["grade"] = a.grade
    if a.target is not None:
        spec["target_min"] = a.target

    r = estimate(spec)
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        print_report(r)
    return 0


if __name__ == "__main__":
    sys.exit(main())
