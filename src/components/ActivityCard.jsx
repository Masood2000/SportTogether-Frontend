import React, { useState } from "react";
import {
    Box, Card, ListItem, Avatar, Typography,
    Chip, IconButton, List, TextField, Button
} from "@mui/material";

// Social Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// Weather Icons
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';

function ActivityCard({ activity, currentUser, onToggleKudo, onAddComment }) {
    // The card manages its own comment input state
    const [commentInput, setCommentInput] = useState("");

    const hasLiked = currentUser && activity.likedByUserIds?.includes(currentUser.id);

    const handlePostComment = () => {
        if (!commentInput.trim()) return;
        onAddComment(activity.id, commentInput);
        setCommentInput(""); // Clear the input after posting
    };

    // Helper to pick the right weather icon
    const renderWeatherIcon = (condition) => {
        if (!condition) return null;
        switch (condition.toUpperCase()) {
            case 'CLEAR': return <WbSunnyIcon sx={{ fontSize: 18, color: '#FFD700', mr: 0.5 }} />;
            case 'CLOUDY': return <CloudIcon sx={{ fontSize: 18, color: '#C0C0C0', mr: 0.5 }} />;
            case 'RAIN':
            case 'THUNDERSTORM': return <UmbrellaIcon sx={{ fontSize: 18, color: '#00E5FF', mr: 0.5 }} />;
            case 'SNOW': return <AcUnitIcon sx={{ fontSize: 18, color: '#FFFFFF', mr: 0.5 }} />;
            default: return <CloudIcon sx={{ fontSize: 18, color: '#C0C0C0', mr: 0.5 }} />;
        }
    };

    return (
        <Card elevation={0} sx={{
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
            mb: 3 // Margin bottom so they stack nicely in the feed
        }}>
            <ListItem alignItems="flex-start" sx={{ py: 3, px: 3, flexDirection: 'column' }}>

                {/* Header: User Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 45, height: 45, mr: 2 }}>
                        {activity.user?.name ? activity.user.name[0].toUpperCase() : '@'}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                            {activity.user?.name} <span style={{ color: '#A020F0', fontWeight: 'normal', fontSize: '0.9rem' }}>@{activity.user?.username}</span>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(activity.dateLogged).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </Typography>
                    </Box>
                </Box>

                {/* Body: Activity Details */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={activity.sportType} color="primary" variant="outlined" />
                    <Chip label={`${activity.durationMinutes} mins`} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} />
                    {activity.distanceKm > 0 && (
                        <Chip label={`${activity.distanceKm} km`} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} />
                    )}
                </Box>

                {activity.notes && (
                    <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2, borderLeft: '3px solid #FF2A5F', pl: 2 }}>
                        "{activity.notes}"
                    </Typography>
                )}

                {/* Calories Burned */}
                <Typography variant="subtitle2" sx={{ color: '#FF2A5F', fontWeight: 'bold', mb: 0.5 }}>
                    🔥 Burned {Math.round(activity.caloriesBurned)} calories
                </Typography>

                {/* NEW: Weather Badge (Only shows if weather data exists) */}
                {activity.temperature !== null && activity.weatherCondition && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                        {renderWeatherIcon(activity.weatherCondition)}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {activity.temperature}°C • {activity.weatherCondition}
                        </Typography>
                    </Box>
                )}

                {/* Interaction Bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', pt: 1, mt: 1 }}>
                    <IconButton onClick={() => onToggleKudo(activity.id)} sx={{ color: hasLiked ? '#FF2A5F' : 'text.secondary' }}>
                        {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="body2" sx={{ color: hasLiked ? '#FF2A5F' : 'text.secondary', fontWeight: 'bold', mr: 2 }}>
                        {activity.likedByUserIds?.length || 0} Kudos
                    </Typography>

                    <ChatBubbleOutlineIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                        {activity.comments?.length || 0} Comments
                    </Typography>
                </Box>

                {/* Comments Section */}
                <Box sx={{ mt: 2, width: '100%', pl: 1, borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                    <List sx={{ p: 0 }}>
                        {activity.comments?.map((comment) => (
                            <ListItem key={comment.id} sx={{ px: 0, py: 0.5 }}>
                                <Typography variant="body2" sx={{ color: 'white' }}>
                  <span style={{ fontWeight: 'bold', color: '#00E5FF', marginRight: '8px' }}>
                    {comment.user?.username}
                  </span>
                                    {comment.text}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>

                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handlePostComment(); }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4, bgcolor: 'rgba(255,255,255,0.03)', fontSize: '0.85rem'
                                }
                            }}
                        />
                        <Button
                            variant="text"
                            onClick={handlePostComment}
                            sx={{ color: '#00E5FF', fontWeight: 'bold', textTransform: 'none' }}
                        >
                            Post
                        </Button>
                    </Box>
                </Box>

            </ListItem>
        </Card>
    );
}

export default ActivityCard;