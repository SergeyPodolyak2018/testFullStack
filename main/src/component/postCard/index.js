import styles from './postCard.module.css';
import Card from 'react-bootstrap/Card';

export function PostCard(props) {

  return (
    <Card style={{marginBottom:'20px', width:'100%'}}>
      <Card.Header>{props.element.title}</Card.Header>
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p>
            {' '}
            {props.element.body}
          </p>
        </blockquote>
      </Card.Body>
    </Card>
  )
}
