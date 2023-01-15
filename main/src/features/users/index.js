import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {selectUsers, getUsers, selectActiveAlbom} from "./usersSlice";
import styles from './users.module.css';
import {UsersCard} from '../../component/userCard';
import {Alboms} from '../albums';



export function Users() {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  const activeAlboms = useSelector(selectActiveAlbom);


  useEffect(() => {
    if(users.length === 0){
      dispatch(getUsers())
    }

  }, [])
  return (
    <div className={styles.usersContainer}>
      {activeAlboms>0?<Alboms/>:''}
      {users.map((el,i) => <UsersCard key={''+i+el.id} element={el}/>)}
    </div>
  )
}


