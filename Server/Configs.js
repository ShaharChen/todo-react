const data = (username) => JSON.stringify({
    "collection": "User",
    "database": "ToDo",
    "dataSource": "Cluster0",
    "filter": {
        "username": username
    },
});
const signInConfig = (username) => ({
    method: 'POST',
    url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-bhdplvu/endpoint/data/v1/action/find',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '8u6furt7nZhJgWgUfqKpoNAsVoLQ0bz3nAEWZPaMOkti8p2kK16g0LwH8CnI2CBy',
    },
    data: data(username)
});


const chorePostData = (username, chores) => JSON.stringify({
    "collection": "UserToDo",
    "database": "ToDo",
    "dataSource": "Cluster0",
    "filter": { "username": username },
    "update": {
        "$set": { "chores": chores }
    }
});

const getUpdateListConfig = (username, choreList) => ({
    method: 'POST',
    url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-bhdplvu/endpoint/data/v1/action/updateOne',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '8u6furt7nZhJgWgUfqKpoNAsVoLQ0bz3nAEWZPaMOkti8p2kK16g0LwH8CnI2CBy',
    },
    data: chorePostData(username, choreList)
});

const getChoresData = (username) => JSON.stringify({
    "collection": "UserToDo",
    "database": "ToDo",
    "dataSource": "Cluster0",
    "filter": { 
        "username": username
    },
});

const getListConfig = (username) => ({
    method: 'POST',
    url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-bhdplvu/endpoint/data/v1/action/findOne',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '8u6furt7nZhJgWgUfqKpoNAsVoLQ0bz3nAEWZPaMOkti8p2kK16g0LwH8CnI2CBy',
    },
    data: getChoresData(username)
});

module.exports = {
    getListConfig,
    getUpdateListConfig,
    signInConfig
};