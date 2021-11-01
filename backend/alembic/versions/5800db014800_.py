"""empty message

Revision ID: 5800db014800
Revises: 2e911d95a8db
Create Date: 2021-10-31 22:29:28.614121

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5800db014800'
down_revision = '2e911d95a8db'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('typestudy', sa.Column('study_consent_template', sa.String(), nullable=False))
    op.create_unique_constraint(None, 'typestudy', ['study_consent_template'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'typestudy', type_='unique')
    op.drop_column('typestudy', 'study_consent_template')
    # ### end Alembic commands ###
