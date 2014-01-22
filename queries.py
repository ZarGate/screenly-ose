
comma = ','.join
quest = lambda l: '=?,'.join(l) + '=?'

exists_table = "SELECT table_name FROM information_schema.tables WHERE table_schema ='table' AND table_name ='screenly_assets'"

read_all = lambda keys: 'select ' + comma(keys) + ' from screenly_assets order by play_order'
read = lambda keys: 'select ' + comma(keys) + ' from screenly_assets where asset_id=?'
create = lambda keys: 'insert into screenly_assets (' + comma(keys) + ') values (' + comma(['?'] * len(keys)) + ')'
remove = 'delete from screenly_assets where asset_id=?'
update = lambda keys: 'update screenly_assets set ' + quest(keys) + ' where asset_id=?'
