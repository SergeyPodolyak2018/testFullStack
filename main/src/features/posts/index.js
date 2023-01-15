import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import {selectPosts, getPosts} from "../users/usersSlice";
import styles from './posts.module.css';
import {PostCard} from '../../component/postCard'



export function Posts() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const {id} = useParams();



  useEffect(() => {
    if(!posts[id]){
      dispatch(getPosts(id))
    }
  }, [])

  const getsomePost=()=>{return posts[id] || []}
  return (
    <div className={styles.usersContainer}>
      {getsomePost().map((el,i) => <PostCard key={''+i+el.id} element={el}/>)}
    </div>
  )
}


