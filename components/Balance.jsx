import {
  Card,
  Text,
  Loader,
  Alert,
  Avatar,
  Group,
  Button,
  SimpleGrid,
  TextInput,
  rem,
} from "@mantine/core";
import {
  IconCurrencyDollar,
  IconRefresh,
  IconAlertCircle,
  IconCurrencyNaira,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

const Balance = ({ pin }) => {
  const fetchCustomerBalance = async (pin) => {
    const response = await fetch("/api/client/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (response.status === 401)
      throw new Error("Session expired. Refreshing...");
    if (response.status === 404) throw new Error("No Balance found.");
    if (!response.ok) throw new Error("Failed to fetch customer balance.");

    return await response.json();
  };

  const {
    data: customerBalance,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["customerBalance", pin], // Cache data by pin
    queryFn: () => fetchCustomerBalance(pin),
    staleTime: 15 * 60 * 1000, // Cache for 15 mins
    refetchOnMount: false, // Don't refetch when remounting
    refetchOnWindowFocus: false, // Avoid auto-fetching when switching tabs
  });

  return (
    <Card shadow="md" radius="md" p="lg" withBorder>
      <Group position="apart">
        <Group>
          <Avatar size={50} color="blue">
            <IconCurrencyNaira size={30} />
          </Avatar>
          <div>
            <Text size="lg" weight={600}>
              Account Balance
            </Text>
            <Text size="sm" c="dimmed">
              PIN: {pin}
            </Text>
          </div>
        </Group>
        <Button
          variant="light"
          color="blue"
          onClick={() => window.location.reload()}
        >
          <IconRefresh size={20} />
        </Button>
      </Group>

      <div style={{ marginTop: 20 }}>
        {isLoading && <Loader size="sm" color="blue" />}

        {error && (
          <Alert icon={<IconAlertCircle />} color="red">
            {error}
          </Alert>
        )}

        {customerBalance && (
          <div>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={customerBalance.rsaBalance}
                label="RSA Balance"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
              <TextInput
                readOnly
                value={customerBalance.totalBalance}
                label="Total Balance"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
            </SimpleGrid>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={customerBalance.totalBalanceText}
                label="Total Balance In Words"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
              <TextInput
                readOnly
                value={customerBalance.rsaUnits}
                label="RSA Units"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
            </SimpleGrid>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={customerBalance.totalUnits}
                label="Total Units"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
              <TextInput
                readOnly
                value={customerBalance.volumeBalance}
                label="Volume Balance"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
            </SimpleGrid>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={customerBalance.volumeUnits}
                label="Volume Units"
                radius="8px"
                mt="sm"
                mb={rem(4)}
                styles={{
                  input: {
                    height: rem(50),
                  },

                  label: {
                    fontWeight: "700",
                    color: "#222",
                    marginBottom: "2px",
                  },
                }}
              />
            </SimpleGrid>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Balance;
