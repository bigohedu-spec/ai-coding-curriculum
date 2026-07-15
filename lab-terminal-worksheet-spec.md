# Lab Terminal — 學習單管理系統 Feature Spec

> **版本**：v1.1  
> **日期**：2026-05-27  
> **狀態**：✅ 設計確認，可開發  
> **Tech Stack**：Firebase (Firestore + Auth + Storage) + React

---

## 已確認決策

| # | 問題 | 決定 |
|---|------|------|
| 1 | 一份學習單發給幾個班？ | **一對一**：每份學習單綁定單一班級 |
| 2 | 學生端如何取得學習單？ | **學生自己瀏覽**，已完成的有標記 |
| 3 | 金幣撤銷時效？ | **無限制**，隨時可撤銷 |
| 4 | 跨週學習歷程？ | **全部持久化**，需支援跨週查詢 |
| 5 | Auth 系統？ | **已有**，直接沿用 |

---

## 一、功能概述

為 Lab Terminal 新增「學習單管理」模組：

**老師端（後台）**
1. 上傳 Markdown 格式的學習單，系統自動解析任務 + 金幣
2. 指定班級後發布
3. 在進度矩陣勾選學生完成任務 → 自動加分
4. 查看完整操作紀錄（含跨週累積）

**學生端**
1. 瀏覽屬於自己班級的所有學習單（已完成/未完成分別標記）
2. 點入任意學習單閱讀，查看自己的任務完成狀態
3. 老師加分後即時顯示通知
4. 查看個人學習歷程（跨週持久化紀錄）

---

## 二、使用者故事

### 老師端

| ID | 作為老師，我想要… | 驗收條件 |
|----|----------------|---------|
| T1 | 上傳本週學習單（.md 格式） | 系統解析出任務列表，可預覽確認後發布 |
| T2 | 指定班級後發布學習單 | 只有該班學生能看到 |
| T3 | 看到全班學生本週進度一覽 | 矩陣表格：每位學生 × 每個任務的完成狀態 |
| T4 | 勾選某學生的任務完成 | 金幣立即進帳，可無限制撤銷 |
| T5 | 批次核准同一任務的多位學生 | 任務欄 header 支援全選，或 shift + 點選多格 |
| T6 | 查看完整操作紀錄 | Audit log：時間 / 老師 / 學生 / 任務 / 金幣 |
| T7 | 查看某學生的跨週學習歷程 | 依學生篩選，列出所有已完成任務與累積金幣 |

### 學生端

| ID | 作為學生，我想要… | 驗收條件 |
|----|----------------|---------|
| S1 | 瀏覽我班級的所有學習單 | 列表按週次排列，已全部完成的有綠色徽章 |
| S2 | 點入學習單閱讀內容 | Markdown 正確渲染，任務區有我的完成狀態 |
| S3 | 知道我哪些任務完成了 | 已完成任務顯示勾號 + 獲得的金幣數 |
| S4 | 老師加分時收到通知 | 即時 Toast 通知「任務 A 完成！+10 金幣」 |
| S5 | 查看我的學習歷程 | 個人頁：所有已完成任務的時間軸，跨週排列 |

---

## 三、Firestore 資料模型

### 3.1 `worksheets/{worksheetId}`

```typescript
interface Worksheet {
  id: string;               // 自動生成
  title: string;            // e.g. "S1 W03｜命名冒險"
  semester: string;         // e.g. "S1"
  week: number;             // e.g. 3
  markdownContent: string;  // 原始 Markdown 全文
  tasks: Task[];            // 從 Markdown 解析出的任務陣列
  classId: string;          // ✅ 一對一班級（非 array）
  isPublished: boolean;
  publishedAt: Timestamp | null;
  createdAt: Timestamp;
  createdBy: string;        // teacher userId
  updatedAt: Timestamp;
}

interface Task {
  taskId: string;           // e.g. "A", "B", "C", "D"
  label: string;            // e.g. "任務 A"
  description: string;      // 任務說明（從 Markdown 解析）
  coins: number;            // 從 Markdown 解析出的金幣數
  isOptional: boolean;      // 是否為進階可選任務
}
```

### 3.2 `studentProgress/{studentId}/worksheets/{worksheetId}`

```typescript
interface StudentWorksheetProgress {
  studentId: string;
  worksheetId: string;
  semester: string;         // 冗餘儲存，方便跨週查詢
  week: number;             // 冗餘儲存，方便排序
  classId: string;          // 冗餘儲存，方便班級篩選
  firstOpenedAt: Timestamp; // 學生第一次點開此學習單的時間
  tasks: Record<string, TaskProgress>;  // key = taskId ("A", "B"...)
  totalCoinsAwarded: number;            // 此學習單累積金幣
  completedTaskCount: number;           // 方便 UI 快速判斷是否「全部完成」
  lastUpdatedAt: Timestamp;
}

interface TaskProgress {
  completed: boolean;
  completedAt: Timestamp | null;
  approvedBy: string | null;    // teacher userId
  approverName: string | null;  // 冗餘儲存，方便 history 顯示
  coinsAwarded: number;
}
```

> **設計說明**：`semester`、`week`、`classId` 冗餘存入 progress，
> 是為了讓「學習歷程查詢」可以只掃 `studentProgress/{studentId}/worksheets`
> 這一個 sub-collection，不需要 JOIN worksheets collection。

### 3.3 `users/{userId}`（沿用 + 擴充）

```typescript
// 沿用現有 Auth，確認以下欄位存在即可
interface UserProfile {
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  classId: string;          // 學生所屬班級（teacher 可為空或多個）
  coins: number;            // 總金幣餘額（由 Cloud Function 維護）
  // ...其他現有欄位保持不動
}
```

### 3.4 `auditLog/{logId}`

```typescript
interface AuditLog {
  action: 'award_coins' | 'revoke_coins';
  teacherId: string;
  teacherName: string;      // 冗餘，顯示用
  studentId: string;
  studentName: string;      // 冗餘，顯示用
  worksheetId: string;
  worksheetTitle: string;   // 冗餘，顯示用
  semester: string;
  week: number;
  taskId: string;
  taskLabel: string;        // e.g. "任務 A"
  coins: number;            // 正數 = 加分，負數 = 撤銷
  timestamp: Timestamp;
}
```

> **查詢模式**：
> - 老師看全班操作紀錄：`where('teacherId', '==', uid)` + `orderBy('timestamp', 'desc')`
> - 老師看某學生歷程：`where('studentId', '==', sid)` + `orderBy('timestamp', 'desc')`
> - 老師看某學習單紀錄：`where('worksheetId', '==', wid)`

---

## 四、Markdown 解析規則

### 目標格式（符合現有 wiki 學習單規範）

```markdown
## 本週任務

### 任務 A｜建立第一個變數（10 金幣）
完成 xxx 並截圖...

### 任務 B｜函式命名挑戰（15 金幣）
完成 yyy...

### 任務 C｜進階挑戰 — 可選（20 金幣）
選做...
```

### 解析規則

| 資訊 | Pattern | 說明 |
|------|---------|------|
| 任務代號 | `/#{2,3}\s*任務\s*([A-Z])/` | 擷取 A/B/C/D |
| 金幣數 | `/[（(](\d+)\s*金幣[）)]/` | 全形/半形括號皆支援 |
| 可選任務 | 標題含「可選」或「選修」 | `isOptional: true` |
| 任務說明 | 任務標題到下一個 `###` 之間的文字 | 最多截取 200 字 |

### 解析失敗處理

| 情況 | 行為 |
|------|------|
| 找不到金幣數 | 預設 0，後台黃色警告，老師手動補填後才能發布 |
| 找不到任何任務 | 上傳失敗，紅色錯誤：「請確認學習單包含『任務 A』格式」 |
| Markdown 格式正常但任務 < 1 個 | 同上 |

上傳後顯示「解析預覽」，老師確認無誤後才能點「正式儲存」。

---

## 五、Firebase Storage

```
lab-terminal-storage/
└── worksheets/
    └── {worksheetId}/
        └── original.md     ← 原始 .md 備份（唯讀）
```

- 只有 teacher/admin 可讀寫 Storage
- 學生不需直接存取（Markdown 全文存入 Firestore `markdownContent`）

---

## 六、React 頁面與元件架構

### 6.1 後台（Teacher）

```
/admin/worksheets
└── WorksheetList
    ├── WorksheetCard（標題 / 週次 / 班級 / 狀態徽章）
    └── [+ 新增學習單] 按鈕

/admin/worksheets/new
└── WorksheetUploader
    ├── MarkdownDropzone       ← 拖放上傳 .md
    ├── ParsePreview           ← 解析結果：任務列表 + 金幣（可手動修正）
    ├── ClassSelector          ← 選擇班級（單選）
    └── PublishButton          ← 確認後儲存並發布

/admin/worksheets/{worksheetId}/progress
└── ProgressDashboard
    ├── WeekSelector           ← 切換週次（預設本週）
    ├── ProgressMatrix         ← 核心元件（見第十二節草圖）
    │   ├── Row = 每位學生
    │   ├── Column = 每個任務（A/B/C/D + 金幣標示）
    │   └── CheckboxCell       ← 勾選 → Cloud Function → 即時更新
    ├── BatchApproveBar        ← 多選後批次核准（浮現於底部）
    └── AuditLogPanel          ← 右側抽屜，顯示本學習單的操作紀錄

/admin/students/{studentId}/history
└── StudentHistoryPage         ← ✅ 新增（跨週學習歷程）
    ├── StudentInfo            ← 姓名 / 班級 / 累積金幣
    ├── SemesterFilter         ← 篩選學期
    └── HistoryTimeline        ← 依週次排列，每週已完成任務 + 時間
```

### 6.2 學生端

```
/worksheets                    ← ✅ 新增（學生瀏覽頁）
└── WorksheetBrowse
    ├── SemesterTabs           ← S1 / S2 / ... 分頁
    └── WorksheetCard[]
        ├── 未完成：灰色，顯示可獲金幣
        └── 全部完成：綠色勾號徽章 + 已獲金幣

/worksheets/{worksheetId}
└── WorksheetPage
    ├── MarkdownRenderer       ← Markdown 內容渲染
    ├── TaskStatusOverlay      ← 覆蓋在任務標題旁：✓ 已完成 / ○ 未完成 + 金幣
    └── CoinToast              ← 即時通知（Firestore onSnapshot 觸發）

/profile/history               ← ✅ 新增（學生個人學習歷程）
└── LearningHistoryPage
    ├── CoinSummary            ← 累積金幣 / 完成任務數
    ├── SemesterFilter
    └── HistoryTimeline        ← 依週次排列，每筆記錄：週次 / 任務 / 金幣 / 時間
```

---

## 七、核心操作流程

### 7.1 老師加分

```
老師在 ProgressMatrix 勾選 CheckboxCell
  ↓
前端樂觀更新（UI 立即顯示打勾，避免 lag 感）
  ↓
呼叫 Cloud Function: approveTask(studentId, worksheetId, taskId)
  ↓
Cloud Function — Atomic Transaction：
  1. 讀取 worksheets/{worksheetId} 取得 task.coins
  2. 寫入 studentProgress/{studentId}/worksheets/{worksheetId}
     → tasks.{taskId}: { completed: true, completedAt, approvedBy, coinsAwarded }
     → totalCoinsAwarded += coins
     → completedTaskCount += 1
  3. 更新 users/{studentId}.coins += coins
  4. 寫入 auditLog
  ↓
失敗時：前端回滾樂觀更新，顯示 error toast
  ↓
成功時：
  - 後台 ProgressMatrix 透過 Firestore realtime 同步 ✓
  - 學生端 CoinToast 透過 onSnapshot 觸發 ✓
```

### 7.2 撤銷加分（無時效限制）

```
老師取消勾選 CheckboxCell
  ↓
呼叫 Cloud Function: revokeTask(studentId, worksheetId, taskId)
  ↓
Transaction：
  1. 讀取目前 coinsAwarded（以實際發出的金幣為準，不用任務金幣）
  2. 更新 taskProgress → completed: false, completedAt: null
  3. totalCoinsAwarded -= coinsAwarded
  4. completedTaskCount -= 1
  5. users/{studentId}.coins -= coinsAwarded（最低 0）
  6. auditLog 寫入 action: 'revoke_coins', coins: -N
```

### 7.3 學生瀏覽與開啟學習單

```
學生進入 /worksheets
  ↓
查詢 worksheets where classId == user.classId && isPublished == true
  ↓
對每份學習單，同時查詢 studentProgress/{uid}/worksheets/{wid}
  ↓
依 completedTaskCount vs tasks.length 判斷顯示狀態：
  - 0/N：灰色，可點入
  - 1～N-1：進行中（黃色進度條）
  - N/N：全部完成（綠色徽章）
  ↓
學生點入學習單 → 若 firstOpenedAt 為空 → 寫入 firstOpenedAt: now
（不觸發加分，只記錄開啟時間）
```

---

## 八、Cloud Functions

```typescript
// functions/src/worksheets.ts

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

// ── 驗證 helper ────────────────────────────────────────────
async function assertTeacher(uid: string) {
  const snap = await db.doc(`users/${uid}`).get();
  const role = snap.data()?.role;
  if (!['teacher', 'admin'].includes(role)) {
    throw new functions.https.HttpsError('permission-denied', 'Teachers only');
  }
}

// ── approveTask ────────────────────────────────────────────
export const approveTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', '');
  await assertTeacher(context.auth.uid);

  const { studentId, worksheetId, taskId } = data as {
    studentId: string;
    worksheetId: string;
    taskId: string;
  };

  return db.runTransaction(async (tx) => {
    const worksheetSnap = await tx.get(db.doc(`worksheets/${worksheetId}`));
    const worksheet = worksheetSnap.data();
    if (!worksheet) throw new functions.https.HttpsError('not-found', 'Worksheet not found');

    const task = worksheet.tasks.find((t: any) => t.taskId === taskId);
    if (!task) throw new functions.https.HttpsError('not-found', 'Task not found');

    const progressRef = db.doc(`studentProgress/${studentId}/worksheets/${worksheetId}`);
    const progressSnap = await tx.get(progressRef);
    const progress = progressSnap.data();

    // 防重複加分
    if (progress?.tasks?.[taskId]?.completed === true) {
      throw new functions.https.HttpsError('already-exists', 'Task already approved');
    }

    const teacherSnap = await tx.get(db.doc(`users/${context.auth!.uid}`));
    const studentSnap = await tx.get(db.doc(`users/${studentId}`));

    const coins = task.coins as number;
    const now = admin.firestore.FieldValue.serverTimestamp();

    // 1. 更新進度
    tx.set(progressRef, {
      studentId,
      worksheetId,
      semester: worksheet.semester,
      week: worksheet.week,
      classId: worksheet.classId,
      tasks: {
        [taskId]: {
          completed: true,
          completedAt: now,
          approvedBy: context.auth!.uid,
          approverName: teacherSnap.data()?.displayName ?? '',
          coinsAwarded: coins,
        }
      },
      totalCoinsAwarded: admin.firestore.FieldValue.increment(coins),
      completedTaskCount: admin.firestore.FieldValue.increment(1),
      lastUpdatedAt: now,
    }, { merge: true });

    // 2. 更新學生金幣
    tx.update(db.doc(`users/${studentId}`), {
      coins: admin.firestore.FieldValue.increment(coins),
    });

    // 3. 寫 audit log
    tx.set(db.collection('auditLog').doc(), {
      action: 'award_coins',
      teacherId: context.auth!.uid,
      teacherName: teacherSnap.data()?.displayName ?? '',
      studentId,
      studentName: studentSnap.data()?.displayName ?? '',
      worksheetId,
      worksheetTitle: worksheet.title,
      semester: worksheet.semester,
      week: worksheet.week,
      taskId,
      taskLabel: task.label,
      coins,
      timestamp: now,
    });
  });
});

// ── revokeTask ─────────────────────────────────────────────
export const revokeTask = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', '');
  await assertTeacher(context.auth.uid);

  const { studentId, worksheetId, taskId } = data as {
    studentId: string;
    worksheetId: string;
    taskId: string;
  };

  return db.runTransaction(async (tx) => {
    const progressRef = db.doc(`studentProgress/${studentId}/worksheets/${worksheetId}`);
    const progressSnap = await tx.get(progressRef);
    const progress = progressSnap.data();

    const taskProgress = progress?.tasks?.[taskId];
    if (!taskProgress?.completed) {
      throw new functions.https.HttpsError('failed-precondition', 'Task not completed');
    }

    const coinsToRevoke = taskProgress.coinsAwarded as number;
    const worksheetSnap = await tx.get(db.doc(`worksheets/${worksheetId}`));
    const worksheet = worksheetSnap.data()!;
    const now = admin.firestore.FieldValue.serverTimestamp();

    const studentSnap = await tx.get(db.doc(`users/${studentId}`));
    const currentCoins = studentSnap.data()?.coins ?? 0;
    const safeRevoke = Math.min(coinsToRevoke, currentCoins); // 不低於 0

    // 1. 更新進度
    tx.set(progressRef, {
      tasks: {
        [taskId]: {
          completed: false,
          completedAt: null,
          approvedBy: null,
          approverName: null,
          coinsAwarded: 0,
        }
      },
      totalCoinsAwarded: admin.firestore.FieldValue.increment(-coinsToRevoke),
      completedTaskCount: admin.firestore.FieldValue.increment(-1),
      lastUpdatedAt: now,
    }, { merge: true });

    // 2. 扣除金幣
    tx.update(db.doc(`users/${studentId}`), {
      coins: admin.firestore.FieldValue.increment(-safeRevoke),
    });

    // 3. Audit log
    const teacherSnap = await tx.get(db.doc(`users/${context.auth!.uid}`));
    const studentDisplaySnap = await tx.get(db.doc(`users/${studentId}`));
    tx.set(db.collection('auditLog').doc(), {
      action: 'revoke_coins',
      teacherId: context.auth!.uid,
      teacherName: teacherSnap.data()?.displayName ?? '',
      studentId,
      studentName: studentDisplaySnap.data()?.displayName ?? '',
      worksheetId,
      worksheetTitle: worksheet.title,
      semester: worksheet.semester,
      week: worksheet.week,
      taskId,
      taskLabel: worksheet.tasks.find((t: any) => t.taskId === taskId)?.label ?? taskId,
      coins: -safeRevoke,
      timestamp: now,
    });
  });
});
```

---

## 九、Firebase Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 學習單：老師可讀寫；學生只能讀「已發布 且 同班」的
    match /worksheets/{worksheetId} {
      allow read: if isTeacher()
                  || (isAuth()
                      && resource.data.isPublished == true
                      && resource.data.classId == myClassId());
      allow write: if isTeacher();
    }

    // 學生進度：本人 + 老師可讀；寫入只允許 Cloud Function (admin SDK)
    match /studentProgress/{studentId}/worksheets/{worksheetId} {
      allow read: if request.auth.uid == studentId || isTeacher();
      allow write: if false;
    }

    // Users：本人 + 老師可讀；coins 由 Cloud Function 管理
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isTeacher();
      allow write: if false;
    }

    // Audit log：老師可讀；Cloud Function 才能寫
    match /auditLog/{logId} {
      allow read: if isTeacher();
      allow write: if false;
    }

    // ── helpers ──────────────────────────────────────────
    function isAuth() {
      return request.auth != null;
    }
    function isTeacher() {
      return isAuth()
        && get(/databases/$(database)/documents/users/$(request.auth.uid))
             .data.role in ['teacher', 'admin'];
    }
    function myClassId() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid))
               .data.classId;
    }
  }
}
```

---

## 十、開發任務拆解

### Phase 1 — 資料層（約 1.5 天）

- [ ] P1-1：確認現有 `users` collection 欄位，補齊 `classId` / `coins` / `role`
- [ ] P1-2：撰寫 Markdown 解析函式（純 TS，加 unit tests）
- [ ] P1-3：實作 `approveTask` Cloud Function（含 Transaction + 防重複）
- [ ] P1-4：實作 `revokeTask` Cloud Function
- [ ] P1-5：設定 Security Rules，以 Firebase Emulator 驗證讀寫權限

### Phase 2 — 後台 UI（約 2.5 天）

- [ ] P2-1：`WorksheetUploader` — 拖放上傳 + 解析預覽 + 手動修正 + 班級選擇
- [ ] P2-2：`WorksheetList` — 列表 + 發布/下架切換 + 前往進度矩陣入口
- [ ] P2-3：`ProgressMatrix` — 學生 × 任務矩陣，Firestore realtime 訂閱
- [ ] P2-4：`CheckboxCell` — 勾選 → 樂觀更新 → Cloud Function → 失敗回滾
- [ ] P2-5：`BatchApproveBar` — 多選底部浮現列，批次核准
- [ ] P2-6：`AuditLogPanel` — 右側抽屜，本學習單的操作紀錄
- [ ] P2-7：`StudentHistoryPage` — 跨週學習歷程（依學生查詢）

### Phase 3 — 學生端 UI（約 1.5 天）

- [ ] P3-1：`WorksheetBrowse` — 班級學習單列表，完成狀態標記
- [ ] P3-2：`WorksheetPage` — Markdown 渲染 + `TaskStatusOverlay`
- [ ] P3-3：`CoinToast` — Firestore onSnapshot 觸發即時通知
- [ ] P3-4：`LearningHistoryPage` — 個人跨週學習歷程時間軸

### Phase 4 — 整合測試（約 1 天）

- [ ] P4-1：E2E：老師上傳 → 解析 → 勾選 → 學生即時收到金幣 + Toast
- [ ] P4-2：邊界：撤銷加分 / 重複勾選防護 / 金幣低於 0 保護
- [ ] P4-3：跨週歷程：完成多週任務後查詢學習歷程，驗證全數持久化
- [ ] P4-4：壓力：一班 20 人同時加分（Transaction 完整性驗證）

---

## 十一、UI 草圖

### 11.1 ProgressMatrix（後台核心）

```
┌──────────────────────────────────────────────────────────────────┐
│  S1 W03 學習單｜命名冒險  班級：小三甲  [操作紀錄 →]            │
├───────────────┬──────────┬──────────┬───────────┬───────────────┤
│  學生姓名     │ 任務 A   │ 任務 B   │ ★任務 C   │  本週金幣     │
│               │ 10 金幣  │ 15 金幣  │ 20（選）  │               │
├───────────────┼──────────┼──────────┼───────────┼───────────────┤
│ 陳小明        │  ☑ +10   │  ☑ +15   │  ☐        │  25 金幣  ✦  │
│ 林小華        │  ☑ +10   │  ☐       │  ☐        │  10 金幣      │
│ 王小美        │  ☑ +10   │  ☑ +15   │  ☑ +20    │  45 金幣  ✦  │
│ 張小強        │  ☐       │  ☐       │  ☐        │   0 金幣      │
├───────────────┼──────────┼──────────┼───────────┼───────────────┤
│ [全選]        │   3/4    │   2/4    │   1/4     │               │
└───────────────┴──────────┴──────────┴───────────┴───────────────┘
  ★ = 可選任務  ✦ = 主線任務全部完成
```

### 11.2 WorksheetBrowse（學生端）

```
┌──────────────────────────────────────────────────┐
│  我的學習單                                       │
│  [S1] [S2] [S3] ...                              │
├──────────────────────────────────────────────────┤
│  ✅ W01｜新手引導         全部完成  +30 金幣      │
│  🟡 W02｜變數冒險         任務A完成  +10/35 金幣  │
│  ⬜ W03｜命名挑戰         尚未開始  可得 45 金幣  │
│  🔒 W04（尚未發布）                               │
└──────────────────────────────────────────────────┘
```

### 11.3 LearningHistoryPage（學生個人歷程）

```
┌──────────────────────────────────────────────────┐
│  我的學習歷程                  累積：85 金幣 🪙   │
│  [全部] [S1] [S2]                                │
├──────────────────────────────────────────────────┤
│  W03  2026-05-20  任務 B 命名挑戰     +15 金幣   │
│  W02  2026-05-13  任務 A 變數冒險     +10 金幣   │
│  W01  2026-05-06  任務 C 新手全通關   +20 金幣   │
│  W01  2026-05-06  任務 B 生存挑戰     +10 金幣   │
│  W01  2026-05-06  任務 A 新手引導     +10 金幣   │
└──────────────────────────────────────────────────┘
```

---

---

## 十三、學習單視覺設計系統（Design System）

> 依據 S5-W12.pdf 分析而來。所有 AI 生成的學習單 HTML 必須遵守本節規格。

### 13.1 頁面版型庫（Layouts）

| 版型名稱 | 用途 | 結構 |
|---------|------|------|
| `HeroSplit` | 封面、任務封面頁 | 左 30% 淺藍背景 + 插圖；右 70% 白底標題/描述 |
| `FullContent` | 任務說明、反思、自我檢查 | 白底全寬，大標題在上，內容在下 |
| `TwoColumn` | 說明 + 提示框、規劃 + 設計原則 | 左 60% 主內容；右 40% 強調卡片 |
| `ThreeCard` | 今天的冒險目標、設計決策 | 三等份橫排圓角卡片 |

### 13.2 Color Tokens

```css
--color-hero-bg: #DBEAFE;          /* 封面/任務封面左側淺藍 */
--color-navy: #1E3A5F;             /* 深藍大標題 */
--color-navy-card: #1B3A5C;        /* 深藍資訊卡背景 */
--color-blue-accent: #3B82F6;      /* 連結、強調文字 */
--color-task-card-bg: #EFF6FF;     /* 任務說明淺藍卡片 */
--color-gray-code: #F3F4F6;        /* code block / 規劃填空背景 */
--color-green-success: #DCFCE7;    /* 完成條件框、成功提示 */
--color-green-text: #15803D;       /* 完成條件文字 */
--color-amber-warning: #FEF9C3;    /* 警告提示框背景 */
--color-amber-border: #CA8A04;     /* 警告框左側 border */
--color-coin-yellow: #EAB308;      /* 金幣 star 顏色 */
--color-white: #FFFFFF;
--color-text-primary: #111827;
--color-text-secondary: #6B7280;
```

### 13.3 元件庫（Components）

#### CoinBadge
```html
<!-- 黃色星星 + 金幣數 + 任務 ID pill -->
<span class="coin-badge">⭐ 75 金幣</span>
<span class="task-id-pill">S5-W12-A</span>
```

#### TaskCard（三欄卡片用）
```html
<div class="task-card">
  <div class="task-card-header">
    <span class="task-emoji">🔑</span>
    <strong>任務 A</strong>
  </div>
  <p>製作獨立的 login.html 登入頁面...</p>
</div>
```

#### StepList（步驟 1-2-3）
```html
<ol class="step-list">
  <li><strong>步驟名稱</strong><br>說明文字</li>
</ol>
```

#### CompletionBox（完成條件）
```html
<div class="completion-box">  <!-- 綠色左 border 框 -->
  <h3>✅ 完成條件</h3>
  <ul>...</ul>
</div>
```

#### InfoCard（右側強調用）
```html
<!-- 深藍背景白字 -->
<div class="info-card dark">...</div>

<!-- 淺藍背景 -->
<div class="info-card light">...</div>

<!-- 黃色警告 -->
<div class="info-card warning">⚠️ ...</div>

<!-- 綠色成功 -->
<div class="info-card success">✅ ...</div>
```

#### CopilotTipsBox
```html
<div class="copilot-tips">
  <h4>💬 Copilot Chat 提示語</h4>
  <div class="tip-item">「你要做一個 login.html...」</div>
</div>
```

#### TestTable（自我檢查表格）
```html
<table class="test-table">
  <tr><th>#</th><th>測試動作</th><th>應該發生的事</th><th>通過？</th></tr>
  <tr><td>1</td><td>...</td><td>...</td><td>□</td></tr>
</table>
```

#### CoinSummaryTable（金幣結算）
```html
<table class="coin-table">
  <tr><th>任務</th><th>金幣</th><th>狀態</th></tr>
  <tr><td>A：...</td><td>75</td><td>□</td></tr>
</table>
```

### 13.4 頁面結構對應（每份學習單的固定流程）

| 頁次 | 版型 | 內容 |
|------|------|------|
| 1 | `HeroSplit` | 封面：週次標題、副標、標籤（週次 / 金幣 / 任務數）|
| 2 | `ThreeCard` | 今天的冒險目標：A/B/C 三張任務概覽卡 |
| 3 | `TwoColumn` | 開始前規劃：填空設計圖 + 設計原則深藍卡 |
| 4 | `HeroSplit` | 任務 A 封面：插圖 + 任務名稱 + 金幣 + 說明 |
| 5 | `FullContent` | 任務 A 步驟：三步驟 + 完成條件 + Copilot 提示 |
| 6 | `TwoColumn` | 任務 B：概念說明 + 存/讀方法卡 + 警告框 |
| 7 | `FullContent` | 任務 C：設計決策三欄 + 完成條件 |
| 8 | `FullContent` | 安全性自我檢查表格 |
| 9 | `TwoColumn` | 金幣總覽表 + 翻轉教學 TA 任務說明 |
| 10 | `TwoColumn` | 今天學到什麼（反思問題）+ 插圖 |

> ⚠️ 頁面數量與結構依任務數量自動調整（2 個任務 = 少 2 頁；加入安全檢查頁為可選）

---

## 十四、AI 生成管線

### 14.1 整體架構

```
老師上傳 .md 學習單
    ↓
[現有] Markdown Parser（第四節）
    → 解析任務列表 + 金幣 → 存入 Firestore（用於進度追蹤）
    ↓
[新增] AI HTML Generator
    → 輸入：Markdown 全文 + Design System tokens
    → 呼叫：Claude API（claude-sonnet-4-6）
    → 輸出：styled HTML（符合第十三節 Design System）
    → 儲存：Firebase Storage worksheets/{id}/styled.html
    ↓
學生在 Lab Terminal 看到的就是這份 styled HTML（iframe 或直接渲染）
```

### 14.2 AI Prompt 設計

```
SYSTEM:
你是一個 HTML 學習單生成器。你會收到一份 Markdown 格式的學習單內容，
你的任務是輸出一份完整的 single-file HTML，風格完全符合以下 Design System。
只輸出 HTML，不要任何解釋。

<design_system>
[第十三節的完整 CSS tokens 與元件規格]
</design_system>

<page_layout_rules>
[第十三節 13.4 頁面結構對應表]
</page_layout_rules>

USER:
以下是這週的學習單 Markdown 內容：
[markdownContent]
```

### 14.3 生成時機與觸發

| 時機 | 觸發方式 | 說明 |
|------|---------|------|
| 老師上傳 .md 並確認解析預覽後 | 後台「生成樣式版本」按鈕 | 手動觸發，讓老師預覽後再發布 |
| 老師點擊「重新生成」 | 後台按鈕 | 修改內容後重跑 AI |
| 自動（可選） | 上傳成功後自動排隊 | 背景 Cloud Function，完成後通知老師 |

**建議採用手動觸發**，原因：
- 生成需要 5–15 秒，老師需要等待
- 老師應該預覽 styled HTML 確認正確後再發布給學生
- 避免浪費 API 費用（老師可能上傳後還會修改）

### 14.4 Firestore 資料模型補充

```typescript
// 在 Worksheet interface 新增：
interface Worksheet {
  // ...（原有欄位）
  styledHtmlUrl: string | null;   // Firebase Storage URL of styled.html
  styledHtmlGeneratedAt: Timestamp | null;
  styledHtmlStatus: 'pending' | 'generating' | 'ready' | 'error';
}
```

### 14.5 學生端展示方式

```
/worksheets/{worksheetId}
└── WorksheetPage
    ├── 若 styledHtmlStatus === 'ready'
    │   └── <iframe src={styledHtmlUrl} /> 或 dangerouslySetInnerHTML
    ├── 若 status === 'generating'
    │   └── LoadingState「老師正在準備本週學習單...」
    └── TaskStatusOverlay（浮在 HTML 上方）
        └── 每個任務的完成狀態標記（已完成 ✓ / 未完成 ○）
```

> **TaskStatusOverlay 實作說明**：styled HTML 裡的任務區塊需要有固定的 `data-task-id="A"` 屬性，
> React 層在 iframe 外側用絕對定位覆蓋完成狀態 badge，或改用 dangerouslySetInnerHTML 
> 讓 React 可以直接 DOM 操作插入狀態標記。

### 14.6 費用估算

| 項目 | 估計 |
|------|------|
| 平均 Markdown 長度 | ~2,000 tokens |
| 平均輸出 HTML 長度 | ~6,000 tokens |
| 每份學習單 API 成本 | ~0.03–0.05 USD（claude-sonnet-4-6） |
| 每學期（24 週 × 1 份）| ~$0.72–1.20 USD |

費用極低，不需要特別控制；但建議快取 styled HTML，避免重複生成。

---

## 十五、更新後的後台上傳流程（含 AI 生成步驟）

```
老師拖放上傳 .md 檔案
    ↓
① Markdown Parser 解析（即時，前端）
    → 顯示「解析預覽」：任務列表 + 金幣 + 可選標記
    → 老師確認或手動修正
    ↓
② 老師填寫：班級、學期、週次
    ↓
③ 老師點「儲存草稿」
    → Firestore 寫入 Worksheet（isPublished: false）
    → Storage 上傳 original.md
    ↓
④ 老師點「生成樣式版本」
    → styledHtmlStatus: 'generating'
    → Cloud Function 呼叫 Claude API
    → 完成後：Storage 寫入 styled.html，styledHtmlStatus: 'ready'
    → 後台顯示預覽縮圖（iframe）
    ↓
⑤ 老師預覽確認後點「發布給學生」
    → isPublished: true，publishedAt: now
    → 學生端立即可見
```

---

> 最後修改：2026-05-27 v1.2 — 新增 Design System（依 S5-W12.pdf 分析）+ AI HTML 生成管線
