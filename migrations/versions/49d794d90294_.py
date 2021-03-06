"""empty message

Revision ID: 49d794d90294
Revises: 9f300e7dd0b2
Create Date: 2018-11-04 16:08:37.482477

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '49d794d90294'
down_revision = '9f300e7dd0b2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'custom_topic_feed', ['custom_topic_id', 'feed_id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'custom_topic_feed', type_='unique')
    # ### end Alembic commands ###
