import { useEffect, useState } from "react";
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
import { IconUser, IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

const Summary = ({ pin }) => {
  const fetchSummary = async (pin) => {
    const response = await fetch("/api/client/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (response.status === 401)
      throw new Error("Session expired. Refreshing...");
    if (response.status === 404) throw new Error("No summary found.");
    if (!response.ok) throw new Error("Failed to fetch summary.");

    return response.json();
  };

  const {
    data: summary,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["customersummary", pin], // Cache data by pin
    queryFn: () => fetchSummary(pin),
    staleTime: 15 * 60 * 1000, // Cache for 15 mins
    refetchOnMount: false, // Don't refetch when remounting
    refetchOnWindowFocus: false, // Avoid auto-fetching when switching tabs
  });

  return (
    <Card shadow="md" radius="md" p="lg" withBorder>
      <Group position="apart">
        <Group>
          <Avatar size={50} color="teal">
            <IconUser size={30} />
          </Avatar>
          <div>
            <Text size="lg" weight={600}>
              Account Summary
            </Text>
            <Text size="sm" color="dimmed">
              PIN: {pin}
            </Text>
          </div>
        </Group>
        <Button
          variant="light"
          color="teal"
          onClick={() => window.location.reload()}
        >
          <IconRefresh size={20} />
        </Button>
      </Group>

      <div style={{ marginTop: 20 }}>
        {isLoading && <Loader size="sm" color="teal" />}

        {error && (
          <Alert icon={<IconAlertCircle />} color="red">
            {error}
          </Alert>
        )}

        {summary && (
          <div>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={summary.schemeName}
                label="Scheme Name"
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
                value={summary.totalBalance}
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
                value={summary.totalWithdrwal}
                label="Total Withdrawal"
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
                value={summary.totalContributionVoluntary}
                label="Total Contribution Voluntary"
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
                value={summary.totalContributionMandatory}
                label="Total Contribution Voluntary"
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
                value={summary.balanceMandatory}
                label="Balance Mandatory"
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
                value={summary.netContributionMandatory}
                label="Net Contribution Mandatory"
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
                value={summary.totalFeesMandatory}
                label="Total Fees Mandatory"
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

export default Summary;
