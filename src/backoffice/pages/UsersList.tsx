import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Table from "../components/Table";
import EditUserModal from "../components/EditUserModal";
import CreateUserModal from "../components/CreateUserModal";
import { useGetUsersQuery, useDeleteUserMutation } from "../../hooks/userHook";
import { UserInfo } from "../../types/UserInfo";
import { useQueryClient } from "@tanstack/react-query";

const UsersList = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [selectedUsers] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const deleteUserMutation = useDeleteUserMutation();

  const openEditModal = (user: UserInfo) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleUserUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["getUsers"] });
  };

  const handleUserCreate = () => {
    queryClient.invalidateQueries({ queryKey: ["getUsers"] });
  };

  const handleUserDelete = (user: UserInfo) => {
    deleteUserMutation.mutate(user._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      },
    });
  };

  const usersWithSelection = useMemo(
    () =>
      users?.map((user) => ({
        ...user,
        isSelected: selectedUsers.includes(user._id),
      })) || [],
    [users, selectedUsers]
  );

  const columns = useMemo(
    () => [
      { key: "_id" as const, label: "ID" },
      { key: "name" as const, label: "Name" },
      { key: "email" as const, label: "Email" },
      { key: "isAdmin" as const, label: "Admin" },
    ],
    []
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  return (
    <div>
      <Helmet>
        <title>Users List</title>
      </Helmet>
      <h2>Liste des Utilisateurs</h2>
      <Table
        data={usersWithSelection}
        columns={columns}
        onEdit={openEditModal}
        onAdd={openCreateModal}
        onDelete={handleUserDelete} // Pass the delete function
      />
      {showCreateModal && (
        <CreateUserModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onUserCreate={handleUserCreate}
        />
      )}
      {currentUser && (
        <EditUserModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          user={currentUser}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};

export default UsersList;
