"use client";
import { useState } from "react";
import {
  TextInput,
  Button,
  Modal,
  Loader,
  Card,
  Center,
  Text,
  Notification,
  Group,
  Avatar,
  ActionIcon,
  Flex,
  Tooltip,
  Drawer,
  rem,
  SimpleGrid,
} from "@mantine/core";
import {
  IconClipboardList,
  IconFileText,
  IconSearch,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Balance from "@/components/Balance";
import Summary from "@/components/Summary";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState();

  // Ensure component only renders on the client
  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    setCustomerData(null);
    try {
      const response = await fetch("/api/client/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.status === 401)
        throw new Error("Session expired. Refreshing...");
      if (response.status === 404) throw new Error("User not found.");
      if (!response.ok) throw new Error("Failed to fetch customer data.");

      // 3️⃣ Store the result and open the modal
      const data = await response.json();

      console.log(data);

      setCustomerData(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ height: "100vh", flexDirection: "column" }}>
      <Card
        shadow="md"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: 450 }}
      >
        <TextInput
          label="Enter Phone Number"
          placeholder="e.g. +2348123456789"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          size="md"
        />
        <Button fullWidth mt="md" onClick={fetchCustomerData} loading={loading}>
          Search
        </Button>
        {error && (
          <Notification color="red" icon={<IconX size={18} />} mt="md">
            {error} Try again
          </Notification>
        )}
      </Card>

      {customerData && !customerData.message && (
        <Card
          shadow="lg"
          padding="md"
          radius="md"
          withBorder
          style={{
            width: 450,
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Center w="100%">
            <Avatar
              src={customerData.avatar || "https://via.placeholder.com/50"}
              radius="xl"
              size="lg"
            />
            <div>
              <Text fz="sm" weight={600} size="lg">
                {customerData.title}. {customerData.firstname}{" "}
                {customerData.surname}
              </Text>
              <Text size="sm" color="dimmed">
                {customerData.phone}
              </Text>
            </div>
            <Group ml="lg">
              <Tooltip label="View Personal Details">
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="blue"
                  onClick={() => {
                    setModalType("personal");
                    open();
                  }}
                >
                  <IconUser size={20} />
                </ActionIcon>
              </Tooltip>
              {/*  */}
              <Tooltip label="View Customer Summary">
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="green"
                  onClick={() => {
                    setModalType("summary");
                    open();
                  }}
                >
                  <IconClipboardList size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="View Customer Balance">
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="orange"
                  onClick={() => {
                    setModalType("balance");
                    open();
                  }}
                >
                  <IconFileText size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Center>
        </Card>
      )}

      {/* No User Found Message */}
      {customerData && customerData?.message && (
        <Text c="dimmed" size="md" mt="sm">
          No user found for this phone number.
        </Text>
      )}

      {/* Modal for Showing Details */}
      <Drawer
        position="top"
        opened={opened}
        onClose={close}
        fw="700"
        title="User Details"
      >
        {modalType === "personal" && (
          <Card shadow="sm" padding="lg" withBorder>
            <SimpleGrid mb="md" cols={2}>
              <TextInput
                readOnly
                value={customerData.firstname}
                label="First Name"
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
                value={customerData.surname}
                label="Last Name"
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
                value={customerData.email}
                label="Email Address"
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
                value={customerData.fundName}
                label="Fund Name"
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
                value={customerData.permanentAddress}
                label="Permanent Address"
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
                value={customerData.nokName}
                label="Nok Name"
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
                value={customerData.nokSurname}
                label="Nok Surname"
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
                value={customerData.nokRelationship}
                label="Nok Relationship"
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
          </Card>
        )}
        {modalType === "summary" && <Summary pin={customerData?.pin} />}
        {modalType === "balance" && <Balance pin={customerData?.pin} />}
      </Drawer>
    </Center>
  );
}
