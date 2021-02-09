"use strict";

//var _ = require("lodash");

const { ValidationError, EmptyResultError } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      externalId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      posindex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        display: false,
      },
    },
    {
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["externalId"],
        },
      ],
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ["posindex"] },
      },
      hooks: {
        beforeBulkDestroy: function (options) {
          options.individualHooks = true;
          return options;
        },
        beforeDestroy: async function (category, options) {
          let productsCount = await this.sequelize.models.Product.count({
            where: { categoryId: category.id },
          });
          if (productsCount > 0) {
            await this.sequelize.models.Product.destroy({
              where: { categoryId: category.id },
            });
          }

          return options;
        },
      },
    }
  );

  /* Category.hiddenAttributes = ["posindex", "createdAt"];

  Category.prototype.toJSON = function () {
    return _.omit(this.dataValues, Category.hiddenAttributes);
  }; */

  Category.associate = function (models) {
    Category.hasMany(models.Product, { foreignKey: "categoryId" });

    Category.addScope("withAllDescendants", {
      attributes: { exclude: ["posindex"] },
      order: [
        ["posindex", "ASC"],
        [{ model: models.Product, as: "Products" }, "posindex", "ASC"],
        [this.sequelize.col("Products->ProductVariants.posindex"), "ASC"],
        [
          this.sequelize.col(
            "Products->ProductVariants->Variant->Options.posindex"
          ),
          "ASC",
        ],
      ],
      include: [
        {
          model: models.Product,
          include: [
            {
              model: models.ProductVariant,
              include: [
                {
                  model: models.Variant,
                  include: [
                    {
                      model: models.Option,
                    },
                  ],
                },
                {
                  model: models.Option,
                  as: "VariantPrerequisities",
                },
              ],
            },
          ],
        },
      ],
    });

    Category.addScope("withAllActiveDescendants", {
      attributes: { exclude: ["posindex"] },
      order: [
        ["posindex", "ASC"],
        [{ model: models.Product, as: "Products" }, "posindex", "ASC"],
        [this.sequelize.col("Products->ProductVariants.posindex"), "ASC"],
        [
          this.sequelize.col(
            "Products->ProductVariants->Variant->Options.posindex"
          ),
          "ASC",
        ],
      ],
      include: [
        {
          model: models.Product,
          where: { active: true },
          include: [
            {
              model: models.ProductVariant,
              include: [
                {
                  model: models.Variant,
                  include: [
                    {
                      model: models.Option,
                      where: { active: true },
                    },
                  ],
                },
                {
                  model: models.Option,
                  as: "VariantPrerequisities",
                },
              ],
            },
          ],
        },
      ],
    });

    Category.addScope("withProducts", {
      attributes: { exclude: ["posindex"] },
      order: [
        ["posindex", "ASC"],
        [{ model: models.Product, as: "Products" }, "posindex", "ASC"],
      ],
      include: [
        {
          model: models.Product,
        },
      ],
    });
  };

  Category.push = async function (newCategory) {
    let lastCategory = await this.findOne({
      attributes: ["posindex"],
      order: [["posindex", "DESC"]],
      limit: 1,
    });

    newCategory.posindex = lastCategory ? lastCategory.posindex + 1 : 0;

    return await this.create(newCategory);
  };

  Category.move = async function (fromId, fromIndex, toId, toIndex) {
    const t = await this.sequelize.transaction();

    try {
      let categories = await this.findAll({
        order: [["posindex", "ASC"]],
        transaction: t,
      });

      if (!categories || categories.length == 0) {
        const error = "There are no categories";
        console.error(error);
        throw new EmptyResultError(error);
      }

      console.log(categories);

      if (
        !categories[fromIndex] ||
        categories[fromIndex].id != fromId ||
        !categories[toIndex] ||
        categories[toIndex].id != toId
      ) {
        const error =
          "Categories on the server are not in sync with your local copy. Reload the categories and try again.";
        console.error(error);
        throw new ValidationError(error);
      }

      const categoryToMove = categories.splice(fromIndex, 1)[0];
      categories.splice(toIndex, 0, categoryToMove);

      console.log(categories);

      // Reset posindex for each item
      for (
        let categoryIndex = 0;
        categoryIndex < categories.length;
        categoryIndex++
      ) {
        categories[categoryIndex].posindex = categoryIndex;
        await categories[categoryIndex].save({ transaction: t });
      }

      await t.commit();
    } catch (error) {
      console.error(error);
      await t.rollback();
      throw error;
    }
  };

  return Category;
};
