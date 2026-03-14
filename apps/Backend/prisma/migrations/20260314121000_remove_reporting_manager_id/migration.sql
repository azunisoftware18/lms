-- Remove reporting manager field from employee profile
ALTER TABLE `employee`
DROP COLUMN `reportingManagerId`;
