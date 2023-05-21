module.exports = (sequelize, Sequelize) => {
  const TableName = `test`;

  const Test = sequelize.define(
    TableName,
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: TableName,
    }
  );
  Test.removeAttribute("id");
  return Test;
};
