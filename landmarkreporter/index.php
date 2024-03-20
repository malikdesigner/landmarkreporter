<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1 ,maximun-scale">
        <title>Glaxies Image Upload</title>
    </head>
    <body>
        <h1>React Native Image Upload</h1>
        <?php 
        $scan=scandir('uploads');
        foreach($scan as $file){
            if(!is_dir($file)){
                echo '<h3>'.$file.'</h3>';
                echo '<img src="uploads/'.$file.'" style="width: 80px; height: auto;" />';
            }
        }
        ?>
    </body>
</html>