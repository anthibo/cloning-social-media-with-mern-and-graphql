import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../utils/graphql'


function Home() {

    // const { loading, data: { getPosts: posts } } = useQuery(FETCH_POST_QUERY)
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)
    const { user } = useContext(AuthContext)

    return (
        <Grid columns={3} >
            <Grid.Row className='page-title' >
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row >
                {user && (
                    <Grid.Column>
                        <PostForm></PostForm>
                    </Grid.Column>
                )}
                {loading ? (
                    <h1>Loading...</h1>
                ) : (data.getPosts && data.getPosts.map(post => (
                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                        <PostCard post={post} />
                    </Grid.Column>
                )))}
            </Grid.Row>
        </Grid>
    )
}


export default Home