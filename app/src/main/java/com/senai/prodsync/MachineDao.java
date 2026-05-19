package com.senai.prodsync;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import java.util.List;

@Dao
public interface MachineDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Machine> machines);

    @Query("SELECT * FROM maquinas")
    List<Machine> getAll();
}
