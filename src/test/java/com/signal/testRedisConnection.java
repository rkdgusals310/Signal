package com.signal;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

@SpringBootTest
public class testRedisConnection {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Test
    public void testRedisConnection() {
        // 테스트용 키와 값
        String testKey = "testKey";
        String testValue = "testValue";

        // Redis에 데이터 저장
        redisTemplate.opsForValue().set(testKey, testValue);

        // Redis에서 데이터 조회
        String valueFromRedis = redisTemplate.opsForValue().get(testKey);
        System.out.println(valueFromRedis);

        // 저장한 값과 조회한 값이 같은지 확인
        assertEquals(testValue, valueFromRedis, "Redis value should match the test value");

        // 테스트 후 키 삭제
        redisTemplate.delete(testKey);
    }
}
