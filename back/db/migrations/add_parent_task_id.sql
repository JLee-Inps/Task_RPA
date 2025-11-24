-- 상위 업무 ID 컬럼 추가
-- 이 마이그레이션은 tasks 테이블에 parent_task_id 컬럼을 추가합니다.
-- 
-- 사용법:
--   docker exec -i task_rpa_mysql mysql -u taskuser -ptaskpassword task_rpa < back/db/migrations/add_parent_task_id.sql

ALTER TABLE tasks 
ADD COLUMN parent_task_id INT DEFAULT NULL AFTER user_id,
ADD FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
ADD INDEX idx_parent_task_id (parent_task_id);
