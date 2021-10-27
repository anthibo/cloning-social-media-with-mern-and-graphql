import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { FETCH_POSTS_QUERY } from '../utils/graphql'



export default function DeleteButton({ postId, commentId, callback }) {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const MUTATION = commentId ? DELTE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePostOrMutation] = useMutation(MUTATION, {
        update(proxy) {
            setConfirmOpen(false)
            //TODO: remove post from cache
            if (!commentId) {
                let data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                console.log(data)
                let cachedData = { ...data }
                cachedData.getPosts = cachedData.getPosts.filter(p => p.id !== postId);
                data = cachedData
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
            }

            if (callback) {
                callback()
            }
        }
        ,
        variables: {
            postId,
            commentId
        }
    })
    return (
        (
            <>
                <Button as='div' color='red' onClick={() => setConfirmOpen(true)} floated='right'>
                    <Icon name='trash' style={{ margin: 0 }} />
                </Button>
                <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation} />
            </>
        )
    )
}

const DELETE_POST_MUTATION = gql`
mutation deletePost($postId: ID!){
  deletePost(postId: $postId)
}
`
const DELTE_COMMENT_MUTATION = gql`
mutation deleteComment($postId:ID!,$commentId:ID!){
    deleteComment(postId:$postId,commentId:$commentId){
        comments{
            id
            username
            createdAt
            body
        }
        commentCount
    }
}
`
