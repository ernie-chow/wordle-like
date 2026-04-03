import { AppShell, Center, Flex, Text } from "@mantine/core";
import { Game } from "./Game";

function Layout() {
    return (
        <AppShell padding="md" header={{ height: 60 }}>
            <AppShell.Header>
                <Flex align="center" gap="md" justify="center" h="100%" px="lg">
                    <Text size="lg" fw={700}>
                        Wordle-like
                    </Text>
                </Flex>
            </AppShell.Header>

            <AppShell.Main>
                <Flex align="center" direction="column" justify="center" h="100%" p="md" gap="lg">
                    <Center>
                        <Text size="xl">Welcome to the Wordle-like game!</Text>
                    </Center>
                    <Game />
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
}

export default Layout;
