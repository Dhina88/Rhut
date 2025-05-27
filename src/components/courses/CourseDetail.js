import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseRes, commentsRes] = await Promise.all([
          axios.get(`/api/courses/${id}`),
          axios.get(`/api/comments/course/${id}`),
        ]);
        setCourse(courseRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/comments', {
        content: newComment,
        course: id,
        timestamp: document.querySelector('video')?.currentTime || 0,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!course) {
    return <Typography>Course not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {course.title}
      </Typography>
      <Box sx={{ mb: 4 }}>
        <video
          controls
          width="100%"
          style={{ maxHeight: '70vh' }}
          src={course.videoUrl}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Course Notes
        </Typography>
        <Typography variant="body1">{course.notes}</Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {comments.map((comment) => (
            <ListItem key={comment._id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={comment.author.username}
                  src={comment.author.profilePicture}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component="span" variant="subtitle2">
                    {comment.author.username}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                      {comment.timestamp && ` • ${Math.floor(comment.timestamp)}s`}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default CourseDetail; 