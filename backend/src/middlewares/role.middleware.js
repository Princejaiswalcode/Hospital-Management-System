const authorizeRoles=(...allowedRoles)=>{
  return (req,res,next)=>{
    if(!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User role missing"
      });
    }

    const userRole=req.user.role;

    if(!allowedRoles.includes(userRole)){
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this resource"
      });
    }

    next();
  };
};

export default authorizeRoles;
