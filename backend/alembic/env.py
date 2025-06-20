import os
from logging.config import fileConfig
import sys
from pathlib import Path
from dotenv import load_dotenv

from sqlalchemy import create_engine

load_dotenv()

backend_dir = Path(__file__).parent.parent
project_root = backend_dir.parent
sys.path.insert(0, str(project_root))

from sqlmodel import SQLModel

from backend.database.models import Quota, User, Quiz

from alembic import context

# Alembic config object
config = context.config


# Set up loggers
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata

engine = create_engine(os.getenv("DATABASE_SYNC"))


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode, using sync_engine from async engine."""
    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,  # utile si tu modifies les types de colonnes
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
