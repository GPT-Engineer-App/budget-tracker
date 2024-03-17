import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://backengine-6529.fly.dev";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("groceries");
  const [editTransaction, setEditTransaction] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchTransactions();
  }, [accessToken]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const addTransaction = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ date, amount, type, category }),
      });
      if (response.ok) {
        fetchTransactions();
        resetForm();
        toast({
          title: "Transaction added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error adding transaction",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const updateTransaction = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${editTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ date, amount, type, category }),
      });
      if (response.ok) {
        fetchTransactions();
        resetForm();
        onClose();
        toast({
          title: "Transaction updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error updating transaction",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        fetchTransactions();
        toast({
          title: "Transaction deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error deleting transaction",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const resetForm = () => {
    setDate("");
    setAmount("");
    setType("expense");
    setCategory("groceries");
    setEditTransaction(null);
  };

  const openEditModal = (transaction) => {
    setEditTransaction(transaction);
    setDate(transaction.date);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    onOpen();
  };

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        toast({
          title: "Logged in successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Invalid email or password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const signup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        toast({
          title: "Signed up successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error signing up",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <Box p={4}>
      {!accessToken ? (
        <Box>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" mr={4} onClick={login}>
            Login
          </Button>
          <Button onClick={signup}>Sign Up</Button>
        </Box>
      ) : (
        <Box>
          <FormControl mb={4}>
            <FormLabel>Date</FormLabel>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Amount</FormLabel>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Type</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Category</FormLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="groceries">Groceries</option>
              <option value="bills">Bills</option>
              <option value="salary">Salary</option>
            </Select>
          </FormControl>
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={addTransaction}>
            Add Transaction
          </Button>

          <Table mt={8}>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Type</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td>{transaction.date}</Td>
                  <Td>{transaction.amount}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.category}</Td>
                  <Td>
                    <IconButton icon={<FaEdit />} aria-label="Edit" mr={2} onClick={() => openEditModal(transaction)} />
                    <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => deleteTransaction(transaction.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Transaction</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={4}>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Amount</FormLabel>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Type</FormLabel>
                  <Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Category</FormLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="groceries">Groceries</option>
                    <option value="bills">Bills</option>
                    <option value="salary">Salary</option>
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={updateTransaction}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Box>
  );
};

export default Index;
