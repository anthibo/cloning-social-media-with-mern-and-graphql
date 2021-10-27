import React, { useContext, useState, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button, Card, Grid, Icon, Image, Label, Form } from 'semantic-ui-react'
import gql from 'graphql-tag'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import { set } from 'mongoose'




export default function SinglePost(props) {
    const postId = props.match.params.postId
    console.log(postId)

    const { user } = useContext(AuthContext)
    const commentInputRef = useRef(null)

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    })

    const [comment, setComment] = useState('')

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }


    console.log(data)

    let postMarkup
    if (!data) {
        postMarkup = <p>Loading post....</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }}></LikeButton>
                                <Button as='div' labelPosition='right' onClick={() => console.log('comment on post')}>
                                    <Button basic color='blue'>
                                        <Icon name='comments' />
                                    </Button>
                                    <Label basic color='blue' pointing='left'>{commentCount}</Label>
                                </Button>
                                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}

                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p> Post a comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input type='text'
                                                placeholder='Comment...'
                                                name='comment'
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type='submit'
                                                className='ui button teal'
                                                disabled={comment.trim === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                                            </button>

                                        </div>
                                    </Form>

                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>
                                        {comment.username}
                                    </Card.Header>
                                    <Card.Meta>
                                        {moment(comment.createdAt).fromNow()}
                                    </Card.Meta>
                                    <Card.Description>
                                        {comment.body}
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }
    return (
        postMarkup
    )
}

const FETCH_POST_QUERY = gql`
    query($postId:ID!){
        getPost(postId:$postId){
            id body createdAt username likeCount commentCount
            likes{
            username
                }
            comments{
                id username createdAt body
            }

        }
       
    }
`
const CREATE_COMMENT_MUTATION = gql`
mutation createComment($postId:ID!,$body:String!){
    createComment(postId:$postId,body:$body){
        id username body createdAt
        comments{
            id body createdAt username
        }
         commentCount
    }
}
`