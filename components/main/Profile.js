import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';

import firebase from 'firebase';
require('firebase/firestore')

import { connect } from 'react-redux';


function Profile(props) {
    // const[userPosts, setUserPosts] = useState([]);
    // const[user, serUser] = useState(null);


    const loggedInUser = firebase.auth().currentUser
    const [ posts, setPosts ] = useState([])
    const [ user, setUser ] = useState({name: "", email: ""})
    const [ following, setFollowing ] = useState(false)

    

    useEffect(()=> {
        const { currentUser, posts } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            console.log(user.uid)
            setUser(loggedInUser)
            firebase.firestore()
            .collection('posts')
            .doc(loggedInUser.uid)
            .collection('userPosts')
            .get()
            .then((snapshot) => {
                const newAuthors = [];
                snapshot.forEach(querySnapshot => {
                    const author = {
                        ...querySnapshot.data(),
                        id: querySnapshot.id
                    }
                newAuthors.push(author);
            });
            setPosts(newAuthors);
            console.log(snapshot.exists)
            })
            
        } else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    setUser(snapshot.data())

                })
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .get()
            .then((snapshot) => {
                const newAuthors = [];
                snapshot.forEach(querySnapshot => {
                    const author = {
                        ...querySnapshot.data(),
                        id: querySnapshot.id
                    }
                newAuthors.push(author);
            });
            setPosts(newAuthors);
            console.log(snapshot.exists)
            console.log(props.route.params.uid)
        })
        }

        if (props.following.indexOf(props.route.params.uid) > -1 ) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
        .then(() => {
            setFollowing(true)
        })
    }

    const onUnfollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
        .then(() => {
            setFollowing(true)
        })
    }

    if (user === null) {
        return <View/>
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                title= "Following"
                                onPress={() => onUnfollow()}
                            />
                        ) : (
                            <Button
                                title="Follow"
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) : null}
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={posts}
                    keyExtractor={post => post.id}
                    renderItem={({item}) => (
                        <View style={styles.containerImage}>
                            <Image
                               style={styles.image}
                               source={{uri: item.downloadURL}}
                            />
                        </View>
                       
                    )}
                />
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    containerInfo: {
        margin: 20,

    },
    containerGallery: {
        flex: 1,
    },
    containerImage: {
        flex: 1/3,
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile)
