const Product = require ('../models/products')

const allProducts = async (req, res) =>  {
    const products = await Product.find();
    
    res.status(200).json({
        products
    })

}

const detailProducts = async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    res.status(200).json({
        product
    })

}
//admin panell
const createProducts = async (req, res) => {
    const product = await Product.create(req.body);
    
    res.status(201).json({
        product
    })

}

const deleteProducts = async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    product.remove
    res.status(200).json({
        message: "Product delete completed"
    })

}

const updateProducts = async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json({
        product
    })

}



module.exports={allProducts, detailProducts, createProducts, deleteProducts, updateProducts}