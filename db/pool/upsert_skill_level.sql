INSERT INTO pool_user_skill_levels (user_id, skill_level, discipline)
VALUES (${user_id}, ${skill_level}, ${discipline})
ON CONFLICT ON CONSTRAINT pool_user_skill_levels_user_id_discipline_key
DO UPDATE SET skill_level = EXCLUDED.skill_level;
