from flask import Flask, jsonify, request
import oracledb
from flask_cors import CORS

app = Flask("qpsd")
CORS(app)

def connection():
    connection = oracledb.connect(
    user="GDSMSYS",
    password="DEVENTERPRISE8!",
    dsn="uq00787d.abbvienet.com:1521/PPSDLND1"
)
    return connection





@app.route('/qa_table')
def qa_table():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        """
       SELECT q.prio, 
       TO_CHAR(q.needbydate, 'DD-MON-YYYY') AS needbydate, 
       p.PROTOCOLCD as Trial, 
       pr.PROGRAMCD as Program,
       t.TASKTYPECD as Tasktype, 
       q.TASKDESCRIPTION, 
       c.CSPMCD as CPSM,
       q.BULKLOTNO,  
       o.ORDERABLELOT as OrdLot,
       qe.USERINITIAL as QE, 
      TO_CHAR(q.QECOMPLETED, 'DD-MON-YYYY') AS QEcomplet,
       qp.USERINITIAL as QP    
FROM QPSD_TASKS q
LEFT JOIN programs pr ON pr.PROGRAMID = q.PROGRAM
LEFT JOIN TM1_QPSD_TASKS o ON o.TASKID = q.TASKID
LEFT JOIN protocols p ON p.PROTOCOLID = q.PROTOCOL
LEFT JOIN QPSD_TASKTYPES t ON t.TASKTYPEID = q.TASKTYPE
LEFT JOIN cspms c ON c.CSPMID = q.CSPM
LEFT JOIN Users qe ON qe.USERID = q.QE
LEFT JOIN Users qp ON qp.USERID = q.QP
WHERE q.needbydate >= TO_DATE('01-01-2025', 'DD-MM-YYYY') 
        """
    )
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()] 
    cursor.close()
    conn.close()
    return jsonify(rows)

@app.route('/cspm_table')
def cspm_table():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("""
                SELECT q.prio, 
               TO_CHAR(q.needbydate, 'DD-MON-YYYY') AS needbydate, 
               p.PROTOCOLCD as Trial, 
               t.TASKTYPECD as Tasktype, 
               c.CSPMCD as CPSM,
               q.BULKLOTNO,  
               o.ORDERABLELOT as OrdLot,
                qe.USERINITIAL as QE, 
                qp.USERINITIAL as QP, 
                TO_CHAR(q.QECOMPLETED, 'DD-MON-YYYY') AS QEcomplete,
                q.MP_CHECK
                 FROM QPSD_TASKS q
                LEFT JOIN programs pr ON pr.PROGRAMID = q.PROGRAM
                LEFT JOIN TM1_QPSD_TASKS o ON o.TASKID = q.TASKID
                LEFT JOIN protocols p ON p.PROTOCOLID = q.PROTOCOL
                LEFT JOIN QPSD_TASKTYPES t ON t.TASKTYPEID = q.TASKTYPE
                LEFT JOIN cspms c ON c.CSPMID = q.CSPM
                LEFT JOIN Users qe ON qe.USERID = q.QE
                LEFT JOIN Users qp ON qp.USERID = q.QP
                WHERE q.needbydate >= TO_DATE('01-01-2025', 'DD-MM-YYYY')        
                    
        """
   )
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(rows)


@app.route('/ceo_table')
def ceo_table():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(    """
       SELECT q.TASKID,
               TO_CHAR(q.needbydate, 'DD-MON-YYYY') AS needbydate, 
               p.PROTOCOLCD as Trial, 
               pr.PROGRAMCD as Program,
               t.TASKTYPECD as Tasktype, 
               s.SUPPLY,
               q.TASKDESCRIPTION, 
               c.CSPMCD as CPSM,
               q.BULKLOTNO,  
               o.ORDERABLELOT as OrdLot,
               q.QE,
               TO_CHAR(q.QECOMPLETED, 'DD-MON-YYYY') AS QEcomplet,
               u.USERID as QP
        FROM QPSD_TASKS q
        left join programs pr on pr.PROGRAMID =q.PROGRAM
        left join TM1_QPSD_TASKS o On o.TASKID = q.TASKID
        LEFT JOIN protocols p ON p.PROTOCOLID = q.PROT  OCOL
        LEFT JOIN QPSD_TASKTYPES t ON t.TASKTYPEID = q.TASKTYPE
        LEFT JOIN Users u ON u.USERID = q.QP
        LEFT JOIN cspms c ON c.CSPMID = q.CSPM
        WHERE c.CSPMCD is not null
        AND q.needbydate >= TO_DATE('01-01-2025', 'DD-MM-YYYY')
        """)
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()] 
    cursor.close()
    conn.close()
    return jsonify(rows)

@app.route('/more_detail/<task_id>')
def more_detail(task_id):

        # Convert string to integer
        task_id_num = int(task_id)
        
        conn = connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM QPSD_Tasks WHERE TASKID = :taskid", {'taskid': task_id_num})
        
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        result = dict(zip(columns, row)) if row else {}
    
        cursor.close()
        conn.close()
        return jsonify(result)

@app.route('/taskid_table')
def taskid_table():
    task_id = request.args.get('taskId')  # Get taskId from query parameters
    
    if not task_id:
        return jsonify({'error': 'No taskId provided'}), 400
        
    conn = connection()
    cursor = conn.cursor()
    
    # Query to get all tables related to the given taskId
    cursor.execute(
              """SELECT * FROM QPSD_TASKS 
   WHERE TASKID = :1""", 
    [task_id]

    )
    
    columns = [col[0] for col in cursor.description]
    rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)






