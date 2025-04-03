package org.example.filetransferspring;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class EnvConfig {
    
    @Autowired
    private ConfigurableEnvironment environment;
    
    @PostConstruct
    public void initializeDotenv() {
        Dotenv dotenv = Dotenv.configure().load();
        
        Map<String, Object> envVariables = new HashMap<>();
        
        // Добавляем все переменные из .env файла
        dotenv.entries().forEach(entry -> {
            envVariables.put(entry.getKey(), entry.getValue());
        });
        
        // Важно: убедиться, что URL начинается с jdbc:
        String dbUrl = dotenv.get("DB_URL");
        if (dbUrl != null && !dbUrl.startsWith("jdbc:")) {
            throw new IllegalArgumentException("Database URL in .env must start with 'jdbc:' - Current value: " + dbUrl);
        }
        
        // Добавляем их как новый источник свойств с высоким приоритетом
        MapPropertySource mapPropertySource = new MapPropertySource("dotenvVariables", envVariables);
        environment.getPropertySources().addFirst(mapPropertySource);
    }
}