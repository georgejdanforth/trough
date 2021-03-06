"""empty message

Revision ID: 5c6b898b95c0
Revises: af6d18194eb0
Create Date: 2018-09-22 13:54:35.029935

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '5c6b898b95c0'
down_revision = 'af6d18194eb0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('feeditem', sa.Column('enclosure', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('feeditem', 'enclosure')
    # ### end Alembic commands ###
