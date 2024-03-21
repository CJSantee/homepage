INSERT INTO pool_user_skill_levels (user_id, skill_level)
VALUES (${user_id}, ${skill_level})
ON CONFLICT ON CONSTRAINT pool_user_skill_levels_user_id_key
DO UPDATE SET skill_level = EXCLUDED.skill_level;
