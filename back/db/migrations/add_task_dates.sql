-- tasks 테이블에 시작일, 종료일, 진행률 컬럼 추가
-- 이 파일은 수시로 업데이트될 수 있습니다.
-- 
-- 사용법:
--   mysql -u taskuser -p task_rpa < add_task_dates.sql
-- 또는 MySQL 클라이언트에서:
--   source add_task_dates.sql

-- 컬럼 추가 (MySQL 8.0.19 이상에서 IF NOT EXISTS 지원)
-- 이전 버전의 경우 컬럼이 이미 존재하면 오류가 발생할 수 있으므로
-- 먼저 컬럼 존재 여부를 확인한 후 추가하는 것을 권장합니다.

-- 방법 1: 직접 ALTER (MySQL 8.0.19+)
-- ALTER TABLE tasks 
-- ADD COLUMN IF NOT EXISTS start_date DATETIME AFTER git_summary,
-- ADD COLUMN IF NOT EXISTS end_date DATETIME AFTER start_date,
-- ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0 COMMENT '진행률 (0-100)' AFTER end_date;

-- 방법 2: 안전한 방법 (모든 버전 지원)
-- start_date 컬럼 추가
SET @dbname = DATABASE();
SET @tablename = 'tasks';
SET @columnname = 'start_date';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATETIME AFTER git_summary')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- end_date 컬럼 추가
SET @columnname = 'end_date';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATETIME AFTER start_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- progress 컬럼 추가
SET @columnname = 'progress';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 0 COMMENT ''진행률 (0-100)'' AFTER end_date')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 인덱스 추가 (이미 존재하면 오류 발생, 무시 가능)
CREATE INDEX idx_start_date ON tasks(start_date);
CREATE INDEX idx_end_date ON tasks(end_date);

