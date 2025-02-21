-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "pay_frequency" TEXT NOT NULL DEFAULT 'Monthly',
    "effective_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "employee_id" INTEGER NOT NULL,
    CONSTRAINT "Salary_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Salary" ("amount", "created_at", "effective_date", "employee_id", "id", "pay_frequency", "updated_at") SELECT "amount", "created_at", "effective_date", "employee_id", "id", "pay_frequency", "updated_at" FROM "Salary";
DROP TABLE "Salary";
ALTER TABLE "new_Salary" RENAME TO "Salary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
