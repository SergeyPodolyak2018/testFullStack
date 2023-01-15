import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import {setActiveAlbom} from "../../features/users/usersSlice";

export function UsersCard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openPosts = ()=>{
    console.log(`/posts/${props.element.id}`);
    navigate(`/posts/${props.element.id}`);
  }

  const openAlboms = ()=>{
    dispatch(setActiveAlbom(props.element.id));
  }

  return (
    <Card
          style={{ width: '18rem', margin:'20px' }}
          bg={'light'}
          text={'dark'}>
      <Card.Body>
        <Card.Title>{props.element.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.element.email}</Card.Subtitle>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Company -  {props.element.company.name}</ListGroup.Item>
          <ListGroup.Item>website: {props.element.website}</ListGroup.Item>
        </ListGroup>
        <Card.Body>
          <Button variant="primary" onClick={openPosts}>Posts</Button>
          <Button variant="primary" style={{marginLeft:'100px'}} onClick={openAlboms}>Albums</Button>
      </Card.Body>
    </Card>
  )
}
