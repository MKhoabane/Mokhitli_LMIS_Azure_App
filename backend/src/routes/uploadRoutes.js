
const express=require('express');
const multer=require('multer');
const upload=multer({dest:'uploads/'});
const router=express.Router();
router.post('/',upload.single('file'),(req,res)=>{
    res.json({message:'Uploaded',file:req.file.filename});
});
module.exports=router;
