import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import firebase from 'firebase';
require('firebase/firestore')
import { useNavigation } from '@react-navigation/native';


import { connect } from 'react-redux';


function Feed() {
    const loggedInUser = firebase.auth().currentUser
    const [ posts, setPosts ] = useState([])
    // const [ user, setUser ] = useState({name: "", email: ""})
    const [ following, setFollowing ] = useState([])
    // const [ posts1, setPosts1] = useState([])
    const [authors, setAuthors] = useState([]);
    const navigation = useNavigation()


    useEffect(async()=> {
        // const user = loggedInUser;

        const followingResult = await
            firebase.firestore()
            .collection('following')
            .doc(loggedInUser.uid)
            .collection('userFollowing')
            .get();
        
        const followingIds= [];
        followingResult.forEach (following => {
            followingIds.push(following.id);
        });
        // console.log('followingIds')
        // console.log(followingIds)

        // const newFollowing = []
        // for await (const followingId of followingIds) {
            let posts = []
            for (let i = 0 ; i < followingIds.length; i++) { await
                firebase.firestore()
                .collection("posts")
                .doc(followingIds[i])
                .collection('userPosts')
                .get()
                .then(snapshot => {
                    const newAuthors = [];
                        snapshot.forEach(querySnapshot => {
                            const author = {
                                ...querySnapshot.data(),
                                id: querySnapshot.id
                            }
                        newAuthors.push(author);
                        posts=[...posts, ...newAuthors]
                        // console.log('-------------1')
                        // console.log(posts)
                        // console.log('-------------2')

                    })
                    posts.sort(function(x,y) {
                        return x.creation -y.creation;
                    })
                    // setAuthors(posts)
                    // console.log('posts')
                    // console.log(posts)
                    // setAuthors(newAuthors)
                    // authors=[...authors, ...newAuthors]
                    // [...theArray, `Entry ${theArray.length}`]
                })
                
            }
            setAuthors(posts)
            // console.log('posts')
            // console.log(posts)
            
            // console.log('authors')
            // console.log(authors)
            // console.log('---------B')
            // useEffect(() => {
            //     let posts = [];
            //     if(props.usersLoaded == props.following.length){
            //         for (let i = 0; i < props.following.length; i++){
            //             const user = props.users.find(el => el.uid === props.following[i]);
            //             if(user != undefined){
            //                 posts = [...posts, ...user.posts];
            //             }
            //         }
        
            //         posts.sort(function(x,y) {
            //             return x.creation - y.creation;
            //         })
        
            //         setPosts(posts);
            //     }
        
            // }, [props.usersLoaded])
                
            // authorResults.forEach(author => {
            //     newFollowing.push({
            //         ...author.data(),
            //         id: author.id,
            //     });
            // });
        // }

    }, [loggedInUser])

    if (authors === null) {
        return <View/>
    }
    
    return (

        <View style={styles.container}>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={authors}
                keyExtractor={post => post.id}
                renderItem={({item}) => (
                    <View style={styles.containerImage}>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignContent: 'stretch', marginLeft: 15}} >
                            <Image
                                style={styles.image}
                                source={{uri: item.icon}}
                            />
                            <View style={{flexDirection: 'column'}}>
                            <Text>{item.details}</Text>
                            <Text style={{fontSize:20, marginLeft: 10, marginTop: 3}}>{item.caption}</Text>
                            </View>
                        </View>
                        <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignContent: 'stretch', marginLeft: 15}}>
                            <TouchableOpacity style={{margin: 5}}>
                                <MaterialCommunityIcons name="thumb-up-outline" color={'#FCE38A'} size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{margin: 5}}>
                                <FontAwesome name="handshake-o" size={25} color={'#FCE38A'} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                                <Text>Like</Text>
                                <FontAwsome5 name="thumbs-up" size={24} color={'#FCE38A'} />
                            </TouchableOpacity> */}
                            <TouchableOpacity 
                                onPress={() => navigation.navigate("FeedComment", {nowUser: item.user, userIcon: item.icon, post: item.id})}
                                style={{margin: 5}}
                            >
                                <MaterialCommunityIcons name="chat-outline" color={'#FCE38A'} size={30}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                               
                )}
            />
        </View>
    )   
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
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
        // flex: 1,
        // aspectRatio: 1/1,
        height: 50, 
        width: 50, 
        borderRadius: 100
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
})

export default connect(mapStateToProps, null)(Feed)


// import React, {useState, useEffect} from 'react';
// import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';

// import firebase from 'firebase';
// require('firebase/firestore')

// import { connect } from 'react-redux';


// function Feed(props) {
//     const [ posts, setPosts ] = useState([])
//     const [ following, setFollowing] = useState([])

//     const loggedInUser = firebase.auth().currentUser

//     useEffect(()=> {
//         let posts = [];
//         console.log(loggedInUser.uid)
//         if (props.usersLoaded == props.following.length) {
//             for ( let i = 0; i < props.following.length; i++){
//                 firebase.firestore()
//                 .collection('following')
//                 .doc(loggedInUser.uid)
//             }
//         }
    
//         // if (props.usersLoaded == props.following.length) {
//         //     for (let i = 0; i < props.following.length; i++) {
//         //         const user = props.users.find(el => el.uid === props.following[i]);
//         //         if (user != undefined) {
//         //             posts = [...posts, ...user.posts]
//         //         }
//         //     }

//         //     posts.sort(function (x, y) {
//         //         return x.creation - y.creation;
//         //     })

//         //     setPosts(posts);
        
//         // console.log(user.uid)
//         //     setUser(loggedInUser)
//         //     firebase.firestore()
//         //     .collection('posts')
//         //     .doc(loggedInUser.uid)
//         //     .collection('userPosts')
//         //     .get()
//         //     .then((snapshot) => {
//         //         const newAuthors = [];
//         //         snapshot.forEach(querySnapshot => {
//         //             const author = {
//         //                 ...querySnapshot.data(),
//         //                 id: querySnapshot.id
//         //             }
//         //         newAuthors.push(author);
//         //     });
//         //     setPosts(newAuthors);
//         //     console.log(snapshot.exists)
//         //     })
//         console.log(props)
//     }, [props.usersLoaded])

//     return (
//         <View style={styles.container}>
//                 <FlatList
//                     numColumns={1}
//                     horizontal={false}
//                     data={posts}
//                     renderItem={({item}) => (
//                         <View style={styles.containerImage}>
//                             <Text style={styles.container}>{item.user.name}</Text>
//                             <Image
//                                style={styles.image}
//                                source={{uri: item.downloadURL}}
//                             />
//                         </View>
                       
//                     )}
//                 />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container:{
//         flex: 1,
//     },
//     containerInfo: {
//         margin: 20,

//     },
//     containerGallery: {
//         flex: 1,
//     },
//     containerImage: {
//         flex: 1/3,
//     },
//     image: {
//         flex: 1,
//         aspectRatio: 1/1,
//     }
// })

// const mapStateToProps = (store) => ({
//     currentUser: store.userState.currentUser,
//     following: store.userState.following,
//     users: store.userState.users,
//     usersLoaded: store.usersState.usersLoaded,
// })

// export default connect(mapStateToProps, null)(Feed);