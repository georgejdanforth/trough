"""empty message

Revision ID: 68bced903297
Revises: e344001e185c
Create Date: 2018-10-05 19:43:32.655929

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '68bced903297'
down_revision = 'e344001e185c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_saved_feed_item',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('feeditem_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['feeditem_id'], ['feeditem.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'feeditem_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_saved_feed_item')
    # ### end Alembic commands ###
