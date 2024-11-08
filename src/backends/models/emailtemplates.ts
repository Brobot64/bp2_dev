// // src/models/emailTemplate.ts
// import { Model, DataTypes } from 'sequelize';
// import sequelize from '../config/db';

// class EmailTemplate extends Model {
//   public id!: number;
//   public title!: string;
//   public content!: string;
// }

// EmailTemplate.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'EmailTemplate',
//     tableName: 'email_templates', // specify table name in MySQL
//     timestamps: true,
//   }
// );

// export default EmailTemplate;
