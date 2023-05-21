module.exports = (sequelize, Sequelize) => {
    const TableName = `user`;
    const User = sequelize.define(
      TableName,
      {
        UserPID: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        UserName: {
          type: Sequelize.STRING,
        },
        Password: {
          type: Sequelize.STRING,
        },
        FullName: {
          type: Sequelize.STRING,
        },
        Email: {
          type: Sequelize.STRING,
        },
        Photo: {
          type: Sequelize.STRING,
        },
        Role: {
          type: Sequelize.STRING,
        },
        Active: {
          type: Sequelize.BOOLEAN,
        },
        Organization: {
          type: Sequelize.STRING,
        },
        PasswordResetKey: {
          type: Sequelize.STRING,
        },
        LastLogin: {
          type: Sequelize.DATE,
        },
        LastLogout: {
          type: Sequelize.DATE,
        },
        CreatedAt:{
            type: Sequelize.DATE,
        },
        UpdatedAt: {
          type: Sequelize.STRING,
        },
      },
      {
        timestamps: false,
        freezeTableName: true,
        tableName: TableName,
      }
    );
    User.removeAttribute("id");
    return User;
  };
  