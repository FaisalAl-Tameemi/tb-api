var tbApi = function (server, db) {
    // define an access variable for each collection
    var students = db.collection("students"),
        tutors = db.collection("tutors"),
        inquiries = db.collection("inquiries"),
        sessions = db.collection("sessions"),
        franchisees = db.collection("franchisees"),
        marketing = db.collection("marketing"),
        invoicing = db.collection("invoicing");

    // defining shortcuts of URL requests
    var PATH_STUDENTS = '/students',
        PATH_TUTORS = '/tutors',
        PATH_INQUIRIES = '/inquiries',
        PATH_SESSIONS = '/sessions',
        PATH_FRANCHISEES = '/franchisees',
        PATH_MARKETING = '/marketing',
        PATH_INVOICING = '/invoicing';

    // mapping HTTPs REQUESTS OF ****** STUDENTS *******
    server.get({path: PATH_STUDENTS, version:'0.0.1'}, getAllStudents);
    server.get({path: PATH_STUDENTS+'/:student_id', version:'0.0.1'}, getStudent);
    server.post({path : PATH_STUDENTS + '/comments/add' , version: '0.0.1'} , addComment);
    server.put({path : PATH_STUDENTS + '/update/:student_id' , version: '0.0.1'} , updateStudent);
    server.post({path : PATH_STUDENTS + '/add' , version: '0.0.1'} ,insertStudent);
    server.put({path : PATH_STUDENTS + '/delete/:student_id' , version: '0.0.1'} ,deleteStudent);
    server.post({path : PATH_STUDENTS + '/search-by-name' , version: '0.0.1'} ,searchStudentsByName);
    server.post({path : PATH_STUDENTS + '/search-students' , version: '0.0.1'} , searchStudents);

    // mapping HTTPs REQUESTS OF ****** TUTORS *******
    server.get({path: PATH_TUTORS, version:'0.0.1'}, getAllTutors);
    server.get({path: PATH_TUTORS+'/:tutor_id', version:'0.0.1'}, getTutor);
    server.put({path : PATH_TUTORS + '/update/:tutor_id' , version: '0.0.1'} , updateTutor);
    server.post({path : PATH_TUTORS + '/add' , version: '0.0.1'} ,insertTutor);
    server.put({path : PATH_TUTORS + '/delete/:tutor_id' , version: '0.0.1'} ,deleteTutor);
    server.post({path : PATH_TUTORS + '/search-by-name' , version: '0.0.1'} ,searchTutorsByName);
    server.post({path : PATH_TUTORS + '/search-tutors' , version: '0.0.1'} ,searchTutors);

    // mapping HTTPs REQUESTS OF ****** INQUIRIES *******
    server.get({path: PATH_INQUIRIES, version:'0.0.1'}, getAllInquiries);
    server.get({path: PATH_INQUIRIES + '/not-enrolled', version:'0.0.1'}, getActiveInquiries);
    server.get({path: PATH_INQUIRIES+'/:inquiry_id', version:'0.0.1'}, getInquiry);
    server.put({path : PATH_INQUIRIES + '/update/:inquiry_id' , version: '0.0.1'} , updateInquiry);
    server.post({path : PATH_INQUIRIES + '/add' , version: '0.0.1'}, insertInquiry);
    server.put({path : PATH_INQUIRIES + '/delete/:inquiry_id' , version: '0.0.1'}, deleteInquiry);
    server.post({path : PATH_INQUIRIES + '/search-by-name' , version: '0.0.1'}, searchInquiriesByName);
    server.post({path : PATH_INQUIRIES + '/search-inquiries' , version: '0.0.1'}, searchInquiries);
    server.post({path : PATH_INQUIRIES + '/mapped-statuses' , version: '0.0.1'}, mappedInquiriesByStatus);
    server.post({path : PATH_INQUIRIES + '/mapped-sources' , version: '0.0.1'}, mappedInquiriesBySource);

    // mapping HTTPs REQUESTS OF ****** SESSIONS *******
    server.get({path: PATH_SESSIONS, version:'0.0.1'}, getAllSessions);
    server.get({path: PATH_SESSIONS+'/:session_id', version:'0.0.1'}, getSession);
    server.put({path : PATH_SESSIONS + '/update/:session_id' , version: '0.0.1'} , updateSession);
    server.post({path : PATH_SESSIONS + '/add' , version: '0.0.1'}, insertSession);
    server.put({path : PATH_SESSIONS + '/delete/:session_id' , version: '0.0.1'}, deleteSession);
    server.post({path : PATH_SESSIONS + '/query-sessions' , version: '0.0.1'}, searchSessions);

    // mapping HTTPs REQUESTS OF ****** FRANCHISEES *******
    server.get({path: PATH_FRANCHISEES, version:'0.0.1'}, getAllFranchisees);
    server.get({path: PATH_FRANCHISEES+'/:franchisee_id', version:'0.0.1'}, getFranchisee);
    server.put({path : PATH_FRANCHISEES + '/update/:franchisee_id' , version: '0.0.1'} , updateFranchisee);
    server.post({path : PATH_FRANCHISEES + '/add' , version: '0.0.1'}, insertFranchisee);
    server.put({path : PATH_FRANCHISEES + '/delete/:franchisee_id' , version: '0.0.1'}, deleteFranchisee);
    server.put({path : PATH_FRANCHISEES + '/stop/:franchisee_id' , version: '0.0.1'}, stopFranchisee);
    server.post({path : PATH_FRANCHISEES + '/search-franchisees-by-owner' , version: '0.0.1'}, searchFranchiseesByOwner);
    server.post({path : PATH_FRANCHISEES + '/search-franchisees' , version: '0.0.1'}, searchFranchisees);

    // mapping HTTPs REQUESTS OF ****** MARKETING EXPENSES *******
    server.get({path: PATH_MARKETING, version:'0.0.1'}, getAllExpenses);
    server.get({path: PATH_MARKETING+'/:expense_id', version:'0.0.1'}, getExpenseDetails);
    server.put({path: PATH_MARKETING + '/update/:expense_id' , version: '0.0.1'} , updateExpense);
    server.post({path: PATH_MARKETING + '/add' , version: '0.0.1'}, insertExpense);
    server.put({path: PATH_MARKETING + '/delete/:expense_id' , version: '0.0.1'}, deleteExpense);;
    server.post({path: PATH_MARKETING + '/search-expenses' , version: '0.0.1'}, searchExpenses);

    // mapping HTTPs REQUESTS OF ****** INVOICING *******
    server.post({path: PATH_INVOICING + '/add' , version: '0.0.1'}, insertInvoice);
    server.post({path: PATH_INVOICING + '/search' , version: '0.0.1'}, searchInvoices);
    server.post({path : PATH_INVOICING + '/generate-invoice' , version: '0.0.1'}, generateInvoice);

    /***************************************************************************
     ***************************************************************************
     ***************************** STUDENTS ************************************
     ***************************************************************************
     ***************************************************************************/

    /* 
    @description: get all the students in the database that are active
    @returns: JSON object with all the students that are active
    -------
    NEEDED: specify more parameters to get only active students
    -------
    */
    function getAllStudents(req, res , next){
        // res.setHeader('Access-Control-Allow-Origin','*');
        students.find().limit(20).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: get single student using _id
    @returns: JSON object with the student's data
    */
    function getStudent(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        students.findOne({_id:mongojs.ObjectId(req.params.student_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }
    /* 
    @description: update a student using thier _id and the data  given
    @returns: 
    -------
    NEEDED: more clear return results, accept more fields (the actual ones)
    -------
    */
    function updateStudent(req , res , next){
        student_id = req.params.student_id;
        var student = req.body;
        delete student._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        students.update({_id:mongojs.ObjectId(student_id)},
                    {
                        $set: student
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function addComment(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var new_comment = req.body.new_comment;
     
        students.update({_id : mongojs.ObjectId(req.body.student_id)}, {
            "$push":{
                "comments":{
                    "text":new_comment.text,
                    "posted_by":new_comment.posted_by,
                    "date_posted":new Date()
                }
            }
        },function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201, success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /* 
    @description: insert a student into the database
    @returns: JSON object of that student after successful insert
    -------
    NEEDED: accept more fields (the actual ones)
    -------
    */
    function insertStudent(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var student = req.body;
        // student.name = {first:req.params.first_name, last:req.params.last_name};
     
        students.save(student , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , student);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: match student's first name to case-insensitive
                  regex pattern of the input search string
                  ( SQL equivelant to SELECT * WHERE student_first_name LIKE '%input_here%' )
    @returns: JSON object containing all the matches
    */
    function searchStudentsByName(req , res , next){
        var query = {
                    "student_name":{$regex: (new RegExp(req.body.name, "i")) }
                    };
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        students.find(query , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: delete student by the student_id
    @returns: success message
    */
    function deleteStudent(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        students.remove({_id:mongojs.ObjectId(req.params.student_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchStudents(req , res , next){
        var requestBody = req.body;
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        students.find(requestBody.query, requestBody.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /***************************************************************************
     ***************************************************************************
     ***************************** TUTORS **************************************
     ***************************************************************************
     ***************************************************************************/

    function getAllTutors(req, res , next){
        // res.setHeader('Access-Control-Allow-Origin','*');
        tutors.find().limit(20).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: get single tutor using _id
    @returns: JSON object with the tutor's data
    */
    function getTutor(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        tutors.findOne({_id:mongojs.ObjectId(req.params.tutor_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }
    /* 
    @description: update a tutor using thier _id and the data  given
    -------
    NEEDED: more clear return results, accept more fields (the actual ones)
    -------
    */
    function updateTutor(req , res , next){
        tutor_id = req.params.tutor_id;
        var tutor = req.body;
        delete tutor._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        tutors.update({_id:mongojs.ObjectId(tutor_id)},
                    {
                        $set: tutor
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: insert a tutor into the database
    @returns: JSON object of that tutor after successful insert
    -------
    NEEDED: accept more fields (the actual ones)
    -------
    */
    function insertTutor(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var tutor = req.body;
        // student.name = {first:req.params.first_name, last:req.params.last_name};
     
        tutors.save(tutor, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , tutor);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: match tutor's first name to case-insensitive
                  regex pattern of the input search string
                  ( SQL equivelant to SELECT * WHERE tutor_name LIKE '%input_here%' )
    @returns: JSON object containing all the matches
    */
    function searchTutorsByName(req , res , next){
        var query = {
                    "name":{$regex: (new RegExp(req.body.name, "i")) }
                    };
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        tutors.find(query , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: delete tutor by the _id
    @returns: success message
    */
    function deleteTutor(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        tutors.remove({_id:mongojs.ObjectId(req.params.tutor_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchTutors(req , res , next){
        var requestBody = req.body;
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        tutors.find(requestBody.query, requestBody.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }


    /***************************************************************************
     ***************************************************************************
     ***************************** INQUIRIES ***********************************
     ***************************************************************************
     ***************************************************************************/

    function getAllInquiries(req, res , next){
        // res.setHeader('Access-Control-Allow-Origin','*');
        inquiries.find().limit(20).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function getActiveInquiries(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        inquiries.find({"status._id":{"$ne":"30"}}).limit(20).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: get single inquiry using _id
    @returns: JSON object with the inquiry's data
    */
    function getInquiry(req, res , next){
        console.log("Inquiry request with id:"+req.params.inquiry_id);
        res.setHeader('Access-Control-Allow-Origin','*');
        inquiries.findOne({_id:mongojs.ObjectId(req.params.inquiry_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }
    /* 
    @description: update an inquiry using its _id and the data given
    -------
    NEEDED: more clear return results, accept more fields (the actual ones)
    -------
    */
    function updateInquiry(req , res , next){
        inquiry_id = req.params.inquiry_id;
        var inquiry = req.body;
        delete inquiry._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        inquiries.update({_id:mongojs.ObjectId(inquiry_id)},
                    {
                        $set: inquiry
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: insert an inquiry into the database
    @returns: JSON object of that inquiry after successful insert
    -------
    NEEDED: accept more fields (the actual ones)
    -------
    */
    function insertInquiry(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var inquiry = req.body;
     
        inquiries.save(inquiry, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , inquiry);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: match inquiry's student name to case-insensitive
                  regex pattern of the input search string
                  ( SQL equivelant to SELECT * WHERE student_name LIKE '%input_here%' )
    @returns: JSON object containing all the matches
    */
    function searchInquiriesByName(req , res , next){
        var query = {
                    "student_name":{$regex: (new RegExp(req.body.name, "i")) }
                    };
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        inquiries.find(query , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchInquiries(req , res , next){
        var queryObj = req.body;
        res.setHeader('Access-Control-Allow-Origin','*');
     
        inquiries.find(queryObj.query, queryObj.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: delete inquiry by the inquiry_id
    @returns: success message
    */
    function deleteInquiry(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        inquiries.remove({_id:mongojs.ObjectId(req.params.inquiry_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function mappedInquiriesByStatus(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');

        var queryObj = req.body;
        var editedQuery = {
                            "date_created":{
                                "$gte":queryObj.query.from_date, 
                                "$lt":queryObj.query.to_date
                            }, 
                            "source._id":queryObj.query.source_id,
                            "franchisee_location._id":queryObj.query.location_id
                          };

        if(editedQuery["source._id"] == ""){
            delete editedQuery["source._id"];
        }

        if(editedQuery["franchisee_location._id"] == ""){
            delete editedQuery["franchisee_location._id"];
        }

        var mapFunction = function(){
            var key = this.status._id;
            var value = 1;
            emit( key, value );
        }

        var reduceFunction = function(key, values){
            var reducedObject = 0;

            values.forEach(function(value){
                reducedObject += value;
            });

            return reducedObject;
        }

        inquiries.mapReduce(mapFunction,
                            reduceFunction,
                            {
                                out: {inline: 1},
                                query: editedQuery
                                // finalize: finalizeFunction2
                            },function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next(success);
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function mappedInquiriesBySource(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');

        var queryObj = req.body;
        var editedQuery = {
                            "date_created":{
                                "$gte":queryObj.query.from_date, 
                                "$lt":queryObj.query.to_date
                            }, 
                            "franchisee_location._id":queryObj.query.location_id
                          };

        if(editedQuery["franchisee_location._id"] == ""){
            delete editedQuery["franchisee_location._id"];
        }

        var mapFunction = function(){
            var key = this.source._id;
            var value = 1;
            emit( key, value );
        }

        var reduceFunction = function(key, values){
            var reducedObject = 0;

            values.forEach(function(value){
                reducedObject += value;
            });

            return reducedObject;
        }

        inquiries.mapReduce(mapFunction,
                            reduceFunction,
                            {
                                out: {inline: 1},
                                query: editedQuery
                                // finalize: finalizeFunction2
                            },function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next(success);
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }


    /***************************************************************************
     ***************************************************************************
     ***************************** SESSIONS ************************************
     ***************************************************************************
     ***************************************************************************/

    function getAllSessions(req, res , next){
        // res.setHeader('Access-Control-Allow-Origin','*');
        sessions.find().limit(100).sort({start : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: get single session using _id
    @returns: JSON object with the session's data
    */
    function getSession(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        sessions.findOne({_id:mongojs.ObjectId(req.params.session_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }
    /* 
    @description: update an session using its _id and the data given
    -------
    NEEDED: more clear return results, accept more fields (the actual ones)
    -------
    */
    function updateSession(req , res , next){
        session_id = req.params.session_id;
        var session = req.body;
        delete session._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        sessions.update({_id:mongojs.ObjectId(session_id)},
                {$set: session}, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: insert a session into the database
    @returns: JSON object of that session after successful insert
    -------
    NEEDED: accept more fields (the actual ones)
    -------
    */
    function insertSession(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var session = req.body;
     
        sessions.save(session, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , session);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: match inquiry's student name to case-insensitive
                  regex pattern of the input search string
                  ( SQL equivelant to SELECT * WHERE student_name LIKE '%input_here%' )
    @returns: JSON object containing all the matches
    */
    function searchSessions(req , res , next){
        var queryObj = req.body;
        res.setHeader('Access-Control-Allow-Origin','*');
     
        sessions.find(queryObj.query, queryObj.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /* 
    @description: delete session by the session_id
    @returns: success message
    */
    function deleteSession(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        sessions.remove({_id:mongojs.ObjectId(req.params.session_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }


    /***************************************************************************
     ***************************************************************************
     ***************************** LOCATIONS ***********************************
     ***************************************************************************
     ***************************************************************************/

    function getAllFranchisees(req, res , next){
        // res.setHeader('Access-Control-Allow-Origin','*');
        franchisees.find({active:true}).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: get single tutor using _id
    @returns: JSON object with the tutor's data
    */
    function getFranchisee(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        franchisees.findOne({_id:mongojs.ObjectId(req.params.franchisee_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }
    /* 
    @description: update a tutor using thier _id and the data  given
    -------
    NEEDED: more clear return results, accept more fields (the actual ones)
    -------
    */
    function updateFranchisee(req , res , next){
        franchisee_id = req.params.franchisee_id;
        var franchisee = req.body;
        delete franchisee._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        franchisees.update({_id:mongojs.ObjectId(franchisee_id)},
                    {
                        $set: franchisee
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: insert a tutor into the database
    @returns: JSON object of that tutor after successful insert
    -------
    NEEDED: accept more fields (the actual ones)
    -------
    */
    function insertFranchisee(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var franchisee = req.body;

        franchisees.save(franchisee, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , franchisee);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: match tutor's first name to case-insensitive
                  regex pattern of the input search string
                  ( SQL equivelant to SELECT * WHERE tutor_name LIKE '%input_here%' )
    @returns: JSON object containing all the matches
    */
    function searchFranchiseesByOwner(req , res , next){
        var query = {
                    "owner.name":{$regex: (new RegExp(req.body.owner_name, "i")) },
                    "active": true
                    };
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        franchisees.find(query , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchFranchisees(req , res , next){
        var requestBody = req.body;
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        franchisees.find(requestBody.query, requestBody.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /* 
    @description: delete tutor by the _id
    @returns: success message
    */
    function deleteFranchisee(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        franchisees.remove({_id:mongojs.ObjectId(req.params.franchisee_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }
    /* 
    @description: stop franchisee by the _id
    @returns: success message
    */
    function stopFranchisee(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        franchisee_id = req.params.franchisee_id;

        res.setHeader('Access-Control-Allow-Origin','*');
        franchisees.update({_id:mongojs.ObjectId(franchisee_id)},
                    {
                        $set: { active : false }
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /***************************************************************************
     ***************************************************************************
     ***************************** MARKETING ***********************************
     ***************************************************************************
     ***************************************************************************/

    function getAllExpenses(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        marketing.find({}).sort({_id : -1} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function getExpenseDetails(req, res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        marketing.findOne({_id:mongojs.ObjectId(req.params.expense_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(200 , success);
                return next();
            }
            console.log('Response error '+err);
            return next(err);
        });
    }

    function updateExpense(req , res , next){
        var expense = req.body;
        delete expense._id;

        res.setHeader('Access-Control-Allow-Origin','*');
        marketing.update({_id:mongojs.ObjectId(req.params.expense_id)},
                    {
                        $set: expense
                    }, function(err , success){
            if(success){
                console.log('Update success: '+success);
                res.send(204);
                return next();
            } else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function insertExpense(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var expense = req.body;

        marketing.save(expense, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , expense);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchExpenses(req , res , next){
        var requestBody = req.body;
     
        res.setHeader('Access-Control-Allow-Origin','*');
     
        marketing.find(requestBody.query, requestBody.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function deleteExpense(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
     
        marketing.remove({_id:mongojs.ObjectId(req.params.expense_id)} , function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /***************************************************************************
     ***************************************************************************
     ***************************** INVOICING ***********************************
     ***************************************************************************
     ***************************************************************************/

    function insertInvoice(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var invoice = req.body;

        invoicing.save(invoice, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , invoice);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    function searchInvoices(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');
        var invoice = req.body;

        invoicing.find(requestBody.query, requestBody.projection, function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next();
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }

    /* 
        @params: queryObj = { from_date:"", to_date:"", student_id:"" }
    */
    function generateInvoice(req , res , next){
        res.setHeader('Access-Control-Allow-Origin','*');

        var queryObj = req.body;
        var editedQuery = {
                            "start":{
                                "$gte":queryObj.query.from_date, 
                                "$lt":queryObj.query.to_date
                            }, 
                            "student._id":queryObj.query.student_id
                          };

        var mapFunction = function(){
            var key = this.student._id;
            var value = {
                            session_id: this._id.valueOf(),
                            session_price: (parseFloat(this.num_hours) * parseFloat(this.price_per_hour)),
                            session_date: this.start,
                            tutor_name: this.tutor.name,
                            session_hours: parseFloat(this.num_hours),
                            count: 1
                        }
            emit( key, value );
        }

        var reduceFunction = function(key, values){
            var reducedObject = {
                                    total_price: 0,
                                    count:0,
                                    sessions: []
                                };

            values.forEach(function(value){
                reducedObject.total_price += value.session_price;
                reducedObject.count += value.count;
                reducedObject.total_hours += value.session_hours;
                reducedObject.sessions.push(
                        {
                            session_id: value.session_id,
                            session_date: value.session_date,
                            tutor_name: value.tutor_name,
                            session_total: value.session_price
                        }
                    );
            });

            return reducedObject;
        }

        sessions.mapReduce( mapFunction,
                            reduceFunction,
                            {
                                out: {inline: 1},
                                query: editedQuery
                                // finalize: finalizeFunction2
                            },function(err , success){
            if(success){
                console.log('Response success '+success);
                res.send(201 , success);
                return next(success);
            }else{
                console.log('Response error '+err);
                return next(err);
            }
        });
    }


    return server;
}

module.exports = tbApi;