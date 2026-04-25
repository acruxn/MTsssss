from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OceanBase
    DATABASE_URL: str = "mysql+pymysql://formbuddy:FormBuddy2026!@finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com:3306/finhack_db"

    # Alibaba Cloud - Qwen
    DASHSCOPE_API_KEY: str = ""
    QWEN_BASE_URL: str = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    QWEN_MODEL: str = "qwen-plus"

    # AWS - Bedrock
    AWS_REGION: str = "ap-southeast-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    BEDROCK_MODEL: str = "apac.anthropic.claude-sonnet-4-20250514-v1:0"
    AWS_SESSION_TOKEN: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
