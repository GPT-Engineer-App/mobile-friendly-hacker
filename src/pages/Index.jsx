import { Container } from "@chakra-ui/react";
import StoryList from "../components/StoryList";

const Index = () => {
  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <StoryList />
    </Container>
  );
};

export default Index;