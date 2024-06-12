import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner, Switch, FormControl, FormLabel, Input } from '@chakra-ui/react';
import axios from 'axios';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: storyIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyPromises = storyIds.slice(0, 30).map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top stories:', error);
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => 
    !story.title.toLowerCase().includes('engineering') &&
    !story.title.toLowerCase().includes('design') &&
    !story.title.toLowerCase().includes('psychology') &&
    (!filter || story.title.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Box p={4} bg={darkMode ? 'gray.800' : 'gray.100'} color={darkMode ? 'white' : 'black'}>
      <FormControl display="flex" alignItems="center" mb={4}>
        <FormLabel htmlFor="dark-mode" mb="0">
          Dark Mode
        </FormLabel>
        <Switch id="dark-mode" isChecked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="filter">Filter Stories</FormLabel>
        <Input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Enter keyword to filter" />
      </FormControl>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4}>
          {filteredStories.map(story => (
            <Box key={story.id} p={4} bg={darkMode ? 'gray.700' : 'white'} borderRadius="md" boxShadow="md" width="100%">
              <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
              <Text fontSize="sm">By {story.by}</Text>
              <Text fontSize="sm">{new Date(story.time * 1000).toLocaleString()}</Text>
              <Text fontSize="sm"><a href={story.url} target="_blank" rel="noopener noreferrer">Read more</a></Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default StoryList;