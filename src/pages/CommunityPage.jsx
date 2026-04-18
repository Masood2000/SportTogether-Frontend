import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Box, TextField, Button,
    Card, List, ListItem, ListItemAvatar, Avatar, ListItemText, Alert,
    Tabs, Tab, Badge
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';

function CommunityPage() {
    const [tabValue, setTabValue] = useState(0); // 0 = My Friends, 1 = Search, 2 = Requests
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [myFriends, setMyFriends] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });

    // 1. Declare the functions FIRST to avoid ESLint warnings
    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/friends/requests", { credentials: "include" });
            if (response.ok) setFriendRequests(await response.json());
        } catch (err) { console.error(err); }
    };

    const fetchMyFriends = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/friends/my-friends", { credentials: "include" });
            if (response.ok) setMyFriends(await response.json());
        } catch (err) { console.error(err); }
    };

    // 2. THEN call them in your useEffect
    useEffect(() => {
        fetchRequests();
        fetchMyFriends();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setMessage({ text: "", type: "" });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/api/friends/search?query=${searchQuery}`, { credentials: "include" });
            if (response.ok) setSearchResults(await response.json());
        } catch (err) { console.error(err); }
    };

    const sendFriendRequest = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/request/${userId}`, { method: "POST", credentials: "include" });
            const text = await response.text();
            if (response.ok) {
                setMessage({ text: "Friend request sent!", type: "success" });
            } else {
                setMessage({ text: text, type: "error" });
            }
        } catch (err) { setMessage({ text: "Network error", type: "error" }); }
    };

    const respondToRequest = async (friendshipId, action) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friends/${action}/${friendshipId}`, { method: "POST", credentials: "include" });
            if (response.ok) {
                setMessage({ text: `Request ${action}ed successfully!`, type: "success" });
                fetchRequests(); // Refresh requests list
                fetchMyFriends(); // Refresh friends list so the new friend appears immediately!
            } else {
                setMessage({ text: "Failed to process request.", type: "error" });
            }
        } catch (err) { setMessage({ text: "Network error", type: "error" }); }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                    background: "linear-gradient(45deg, #00E5FF 30%, #A020F0 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 'bold'
                }}>
                    Community
                </Typography>
                <Button variant="outlined" component={Link} to="/home" sx={{ borderRadius: 8 }}>Back to Dashboard</Button>
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({text: "", type: ""})}>
                    {message.text}
                </Alert>
            )}

            {/* TABS NAVIGATION */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label="My Friends" sx={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }} />
                    <Tab label="Find Athletes" sx={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none' }} />
                    <Tab
                        label={
                            <Badge badgeContent={friendRequests.length} color="error" sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}>
                                Requests
                            </Badge>
                        }
                        sx={{ fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', pr: 4 }}
                    />
                </Tabs>
            </Box>

            {/* --- TAB 0: MY FRIENDS --- */}
            {tabValue === 0 && (
                <Box>
                    {myFriends.length === 0 ? (
                        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                            <Typography variant="h6" color="text.secondary">You haven't added any friends yet.</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Go to "Find Athletes" to start building your crew!</Typography>
                        </Box>
                    ) : (
                        <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {myFriends.map((friend) => (
                                <Card key={friend.id} elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <ListItem sx={{ py: 2, px: 3 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF' }}>
                                                {friend.name ? friend.name[0].toUpperCase() : '@'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>{friend.name}</Typography>}
                                            secondary={<Typography variant="body2" sx={{ color: '#00E5FF' }}>@{friend.username}</Typography>}
                                        />
                                        <Button
                                        variant="contained"
                                        component={Link}
                                        to={`/profile/${friend.id}`} // Links to the new page!
                                        sx={{ borderRadius: 8, bgcolor: '#A020F0', '&:hover': { bgcolor: '#8a19d6' } }}
                                    >
                                        View Profile
                                    </Button>


                                    </ListItem>
                                </Card>
                            ))}
                        </List>
                    )}
                </Box>
            )}

            {/* --- TAB 1: SEARCH --- */}
            {tabValue === 1 && (
                <Box>
                    <Card elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 4, mb: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth variant="outlined" placeholder="Search athletes by name or username..."
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />
                            <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 3, bgcolor: '#00E5FF', color: 'black', '&:hover': { bgcolor: '#00B3CC' } }}>
                                <SearchIcon />
                            </Button>
                        </Box>
                    </Card>

                    <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {searchResults.map((user) => (
                            <Card key={user.id} elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)' }}>
                                <ListItem sx={{ py: 2, px: 3 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'rgba(160, 32, 240, 0.2)', color: '#A020F0' }}>
                                            {user.name ? user.name[0].toUpperCase() : '@'}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>{user.name}</Typography>}
                                        secondary={<Typography variant="body2" sx={{ color: '#00E5FF' }}>@{user.username}</Typography>}
                                    />
                                    <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={() => sendFriendRequest(user.id)} sx={{ borderRadius: 8, borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                        Add Friend
                                    </Button>
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </Box>
            )}

            {/* --- TAB 2: REQUESTS INBOX --- */}
            {tabValue === 2 && (
                <Box>
                    {friendRequests.length === 0 ? (
                        <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                            <Typography variant="h6" color="text.secondary">No pending friend requests.</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>When someone adds you, it will show up here.</Typography>
                        </Box>
                    ) : (
                        <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {friendRequests.map((request) => (
                                <Card key={request.id} elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)' }}>
                                    <ListItem sx={{ py: 2, px: 3 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF' }}>
                                                {request.requester.name ? request.requester.name[0].toUpperCase() : '@'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>{request.requester.name}</Typography>}
                                            secondary={<Typography variant="body2" sx={{ color: '#00E5FF' }}>@{request.requester.username} sent you a request</Typography>}
                                        />
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => respondToRequest(request.id, 'accept')} sx={{ borderRadius: 8 }}>
                                                Accept
                                            </Button>
                                            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => respondToRequest(request.id, 'decline')} sx={{ borderRadius: 8 }}>
                                                Decline
                                            </Button>
                                        </Box>
                                    </ListItem>
                                </Card>
                            ))}
                        </List>
                    )}
                </Box>
            )}
        </Container>
    );
}

export default CommunityPage;