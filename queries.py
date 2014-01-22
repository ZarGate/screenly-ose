
comma = ','.join
quest = lambda l: '=%s,'.join(l) + '=%s'

exists_table = "SELECT table_name FROM information_schema.tables WHERE table_schema ='table' AND table_name ='screenly_assets'"

read_all = lambda keys: 'SELECT ' + comma(keys) + ' FROM screenly_assets ORDER BY play_order'
read = lambda keys: 'SELECT ' + comma(keys) + ' FROM screenly_assets where asset_id=%s'
create = lambda keys: 'INSERT INTO screenly_assets (' + comma(keys) + ') VALUES (' + comma(['%s'] * len(keys)) + ')'
remove = 'DELETE FROM screenly_assets WHERE asset_id=%s'
update = lambda keys: 'UPDATE screenly_assets SET ' + quest(keys) + ' WHERE asset_id=%s'
