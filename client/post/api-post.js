const create = (params, credentials, post) => {
    return fetch(`/api/posts/new/${params.userId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        },
        body: post
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const listNewsFeed = (params, credentials) => {
    return fetch(`/api/posts/feed/${params.userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        }
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const listByUser = (params, credentials) => {
    return fetch(`/api/posts/by/${params.userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        }
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const remove = (params, credentials) => {
    return fetch(`/api/posts/${params.postId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        }
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const like = (params, credentials, postId) => {
    return fetch('/api/posts/like', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        },
        body: JSON.stringify({userId: params.userId, postId})
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const unlike = (params, credentials, postId) => {
    return fetch('/api/posts/unlike', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        },
        body: JSON.stringify({userId: params.userId, postId})
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const comment = (params, credentials, postId, comment) => {
    return fetch('/api/posts/comment', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + credentials.t
        },
        body: JSON.stringify({userId: params.userId, postId, comment})
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

const uncomment = (params, credentials, postId, commentId) => {
    return fetch('/api/posts/uncomment', {
        method: 'PUT', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.t}`
        },
        body: JSON.stringify({userId: params.userId, postId, commentId})
    })
    .then(res => { return res.json() })
    .catch(err => { console.log(err) })
}

export {
    listNewsFeed,
    listByUser,
    create, 
    remove, 
    like,
    unlike,
    comment,
    uncomment
}