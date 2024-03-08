import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Table from "../components/Table";
import {
  useContactsQuery,
  useDeleteContactMutation,
} from "../../hooks/contactHook";
import { Contact } from "../../types/Contact";
import { useQueryClient } from "@tanstack/react-query";

const ContactList = () => {
  const {
    data: contacts,
    isLoading,
    error,
    refetch: refetchContacts,
  } = useContactsQuery();
  const queryClient = useQueryClient();
  const { mutate: deleteContact } = useDeleteContactMutation();

  const handleDelete = (contactId: string) => {
    deleteContact(contactId, {
      onSuccess: () => {
        refetchContacts();
      },
      onError: (error) => {
        console.error("Error deleting contact:", error);
      },
    });
  };

  const contactsProcessed = useMemo(
    () => contacts?.map((contact: Contact) => ({
        ...contact,
      })) || [],
    [contacts]
  );

  const columns = useMemo(
    () => [
      {
        _id: "mailColumn",
        key: "mail",
        label: "Email",
      },
      {
        _id: "subjectColumn",
        key: "subject",
        label: "Subject",
      },
      {
        _id: "messageColumn",
        key: "message",
        label: "Message",
      },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching contacts</div>;

  return (
    <div>
      <Helmet>
        <title>Contact List</title>
      </Helmet>
      <h2>Contact List</h2>
      <Table
        data={contactsProcessed}
        columns={columns}
        onDelete={(contact) => handleDelete(contact._id)}
      />
    </div>
  );
};

export default ContactList;