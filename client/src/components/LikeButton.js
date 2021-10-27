import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Button, Icon, Label } from 'semantic-ui-react'

export default function LikeButton({ post: { id, likeCount, likes }, user }) {
    const [liked, setLiked] = useState(false)
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        }
        else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MITATION, {
        variables: { postId: id }
    })

    const LikeButton = user ? (liked ? (
        <Button color='teal' basic>
            <Icon name='heart' />
        </Button>
    ) : (
        <Button color='teal' >
            <Icon name='heart' />
        </Button>
    )) : (<Button color='teal' basic as={Link} to='/login'>
        <Icon name='heart' />
    </Button>)
    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {LikeButton}
            <Label as='a' basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST_MITATION = gql`
mutation likePost($postId:ID!){
    likePost(postId:$postId){
        id
        likes{
            id username
        }
        likeCount
        
    }
}
`








