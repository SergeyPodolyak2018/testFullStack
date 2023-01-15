import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {getAlboms, selectAlboms,selectActiveAlbom,resetActiveAlbom} from "../users/usersSlice";
import styles from './alboms.module.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';



export function Alboms() {
  const dispatch = useDispatch();
  const alboms = useSelector(selectAlboms);
  const id = useSelector(selectActiveAlbom);



  useEffect(() => {
    if(!alboms[id]){
      dispatch(getAlboms(id))
    }
  }, []);

  const getsomeAlboms=()=>{return alboms[id] || []};

  const resetSomeAlboms=()=>{dispatch(resetActiveAlbom())};
  return (
    <div className={styles.container} onClick={resetSomeAlboms}>
      <Card style={{ width: '25rem' }}>
        <Card.Header>Albums</Card.Header>
        <ListGroup variant="flush">
          {getsomeAlboms().map((el,i) => <ListGroup.Item key={''+i+el.id}>{el.title}</ListGroup.Item>)}
        </ListGroup>
      </Card>
    </div>
  )
}


